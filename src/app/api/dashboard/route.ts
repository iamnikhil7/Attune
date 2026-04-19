import { NextRequest, NextResponse } from "next/server";
import {
  getSupabaseAdmin,
  isServerSupabaseConfigured,
  getUserId,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

interface GoalProgress {
  id: string;
  title: string;
  target: number;
  progress: number;
  percent: number;
  status: string;
}

interface DashboardPayload {
  today: {
    activities_attended: number;
    activities_planned: number;
    last_check_in: string | null;
  };
  weekly: {
    streak_days: number;
    activities_this_week: number;
    days_active: number;
  };
  goals: GoalProgress[];
  last_coach_message: { role: string; content: string; created_at: string } | null;
}

/**
 * GET /api/dashboard?user_id=...
 * Real aggregate stats — today's activity, weekly streak, goal completion %,
 * last Harold message. Pulled from Supabase tables/views, no mocks.
 */
export async function GET(req: NextRequest) {
  if (!isServerSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 },
    );
  }

  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "user_id required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  try {
    const [todayActs, weekActs, plannedToday, goalsRes, lastMsg] =
      await Promise.all([
        supabase
          .from("user_activities")
          .select("id, attended_at, status")
          .eq("user_id", userId)
          .eq("status", "attended")
          .gte("attended_at", `${todayStr}T00:00:00Z`)
          .lte("attended_at", `${todayStr}T23:59:59Z`),
        supabase
          .from("user_activities")
          .select("id, attended_at")
          .eq("user_id", userId)
          .eq("status", "attended")
          .gte("attended_at", weekAgo.toISOString()),
        supabase
          .from("user_activities")
          .select("id")
          .eq("user_id", userId)
          .in("status", ["interested", "joined"]),
        supabase
          .from("user_goals")
          .select("id, title, target, progress, status")
          .eq("user_id", userId)
          .neq("status", "completed")
          .order("created_at", { ascending: false }),
        supabase
          .from("coach_conversations")
          .select("role, content, created_at")
          .eq("user_id", userId)
          .eq("role", "assistant")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

    if (todayActs.error) throw todayActs.error;
    if (weekActs.error) throw weekActs.error;
    if (plannedToday.error) throw plannedToday.error;
    if (goalsRes.error) throw goalsRes.error;

    // Streak — count consecutive days backward from today with attended activity
    const dayStrings = new Set(
      (weekActs.data ?? [])
        .map((r) => r.attended_at?.slice(0, 10))
        .filter(Boolean) as string[],
    );
    let streak = 0;
    for (let d = 0; d < 7; d++) {
      const probe = new Date(today.getTime() - d * 86400000)
        .toISOString()
        .slice(0, 10);
      if (dayStrings.has(probe)) streak++;
      else if (d > 0) break;
    }

    const goals: GoalProgress[] = (goalsRes.data ?? []).map((g) => ({
      id: g.id,
      title: g.title,
      target: g.target,
      progress: g.progress,
      percent: g.target > 0 ? Math.min(100, Math.round((g.progress / g.target) * 100)) : 0,
      status: g.status,
    }));

    const todayList = todayActs.data ?? [];

    const payload: DashboardPayload = {
      today: {
        activities_attended: todayList.length,
        activities_planned: (plannedToday.data ?? []).length,
        last_check_in: todayList[0]?.attended_at ?? null,
      },
      weekly: {
        streak_days: streak,
        activities_this_week: (weekActs.data ?? []).length,
        days_active: dayStrings.size,
      },
      goals,
      last_coach_message: lastMsg.data ?? null,
    };

    return NextResponse.json(payload);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}
