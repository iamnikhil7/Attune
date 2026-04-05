import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

/** POST /api/health/connect — save health connection */
export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const body = await req.json();
  const { user_id, provider, permissions } = body;

  if (!user_id || !provider) {
    return NextResponse.json({ error: "user_id and provider required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("health_connections")
    .upsert(
      {
        user_id,
        provider,
        connected: true,
        permissions: permissions || [],
        connected_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** DELETE /api/health/connect — disconnect health data */
export async function DELETE(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const body = await req.json();
  const { user_id } = body;

  if (!user_id) return NextResponse.json({ error: "user_id required" }, { status: 400 });

  const { data, error } = await supabase
    .from("health_connections")
    .update({ connected: false, disconnected_at: new Date().toISOString() })
    .eq("user_id", user_id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
