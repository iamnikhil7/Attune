import { NextRequest, NextResponse } from "next/server";
import {
  getSupabaseAdmin,
  isServerSupabaseConfigured,
  getUserId,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

/** GET /api/goals?user_id=... — return goals for the user. */
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

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("user_goals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ goals: data ?? [] });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}

/** POST /api/goals — create a new goal. */
export async function POST(req: NextRequest) {
  if (!isServerSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 },
    );
  }

  let body: {
    user_id?: string;
    title?: string;
    description?: string | null;
    category?: string | null;
    target?: number;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const userId = body.user_id || getUserId(req);
  if (!userId || !body.title?.trim()) {
    return NextResponse.json(
      { error: "user_id and title are required" },
      { status: 400 },
    );
  }

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("user_goals")
      .insert({
        user_id: userId,
        title: body.title.trim(),
        description: body.description ?? null,
        category: body.category ?? null,
        target: body.target ?? 1,
        progress: 0,
        status: "active",
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ goal: data }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}
