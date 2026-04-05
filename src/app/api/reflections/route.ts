import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

/** GET /api/reflections?user_id=...&unseen=true — fetch Harold's reflections */
export async function GET(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const userId = req.nextUrl.searchParams.get("user_id");
  const unseenOnly = req.nextUrl.searchParams.get("unseen") === "true";

  if (!userId) return NextResponse.json({ error: "user_id required" }, { status: 400 });

  let query = supabase
    .from("harold_reflections")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (unseenOnly) query = query.eq("seen", false);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** POST /api/reflections — create a new reflection */
export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const body = await req.json();
  const { user_id, type, message, detail, orb_state, related_pattern_id, related_activity_id } = body;

  if (!user_id || !type || !message) {
    return NextResponse.json({ error: "user_id, type, and message required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("harold_reflections")
    .insert({ user_id, type, message, detail, orb_state: orb_state || "neutral", related_pattern_id, related_activity_id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** PATCH /api/reflections — mark reflection as seen/dismissed */
export async function PATCH(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const body = await req.json();
  const { id, seen, dismissed } = body;

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const update: Record<string, unknown> = {};
  if (seen) { update.seen = true; update.seen_at = new Date().toISOString(); }
  if (dismissed) { update.dismissed = true; update.dismissed_at = new Date().toISOString(); }

  const { data, error } = await supabase
    .from("harold_reflections")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
