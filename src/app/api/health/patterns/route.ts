import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { runPatternAnalysis } from "@/lib/services/pattern-engine";

/** GET /api/health/patterns?user_id=... — get active patterns */
export async function GET(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const userId = req.nextUrl.searchParams.get("user_id");
  if (!userId) return NextResponse.json({ error: "user_id required" }, { status: 400 });

  const { data, error } = await supabase
    .from("health_patterns")
    .select("*")
    .eq("user_id", userId)
    .eq("active", true)
    .order("detected_at", { ascending: false })
    .limit(5);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** POST /api/health/patterns — trigger pattern analysis for a user */
export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const body = await req.json();
  const { user_id } = body;

  if (!user_id) return NextResponse.json({ error: "user_id required" }, { status: 400 });

  const result = await runPatternAnalysis(user_id);
  return NextResponse.json(result);
}

/** PATCH /api/health/patterns — dismiss a pattern */
export async function PATCH(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const body = await req.json();
  const { id } = body;

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { data, error } = await supabase
    .from("health_patterns")
    .update({ active: false, dismissed_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
