import { NextRequest, NextResponse } from "next/server";
import {
  getSupabaseAdmin,
  isServerSupabaseConfigured,
  getUserId,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

/** GET /api/coach/conversations?user_id=...&limit=20 — recent messages, oldest first. */
export async function GET(req: NextRequest) {
  if (!isServerSupabaseConfigured()) {
    return NextResponse.json({ messages: [] });
  }

  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "user_id required" }, { status: 400 });
  }

  const limit = Math.min(
    Number(req.nextUrl.searchParams.get("limit") ?? "20"),
    100,
  );

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("coach_conversations")
      .select("id, role, content, created_at")
      .eq("user_id", userId)
      .in("role", ["user", "assistant"])
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return NextResponse.json({ messages: (data ?? []).reverse() });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}

/** DELETE /api/coach/conversations?user_id=... — clear chat history. */
export async function DELETE(req: NextRequest) {
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
    const { error } = await getSupabaseAdmin()
      .from("coach_conversations")
      .delete()
      .eq("user_id", userId);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}
