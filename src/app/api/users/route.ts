import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

/** POST /api/users — create or update user after onboarding */
export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const body = await req.json();
  const { email, display_name, location, archetype, activity_preferences, identity_anchor, wellness_baseline } = body;

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        email,
        display_name,
        location,
        archetype,
        activity_preferences: activity_preferences || [],
        identity_anchor,
        wellness_baseline: wellness_baseline || 50,
        onboarding_completed: true,
      },
      { onConflict: "email" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** GET /api/users?email=... — fetch user profile */
export async function GET(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const email = req.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const { data, error } = await supabase.from("users").select("*").eq("email", email).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}
