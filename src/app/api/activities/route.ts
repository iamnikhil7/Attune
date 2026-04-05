import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

/** GET /api/activities — list activities with optional filters */
export async function GET(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const type = req.nextUrl.searchParams.get("type");
  const intensity = req.nextUrl.searchParams.get("intensity");
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "4");

  let query = supabase.from("activities").select("*").eq("active", true).order("is_anchor", { ascending: false }).limit(limit);

  if (type) query = query.eq("type", type);
  if (intensity) query = query.eq("intensity", intensity);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** POST /api/activities — user expresses interest */
export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const body = await req.json();
  const { user_id, activity_id, status } = body;

  if (!user_id || !activity_id) {
    return NextResponse.json({ error: "user_id and activity_id required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("user_activities")
    .upsert(
      { user_id, activity_id, status: status || "interested" },
      { onConflict: "user_id,activity_id" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
