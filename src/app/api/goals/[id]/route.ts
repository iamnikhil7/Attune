import { NextRequest, NextResponse } from "next/server";
import {
  getSupabaseAdmin,
  isServerSupabaseConfigured,
  getUserId,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

interface Params {
  params: Promise<{ id: string }>;
}

/** PATCH /api/goals/[id] — update progress / status / title. */
export async function PATCH(req: NextRequest, { params }: Params) {
  if (!isServerSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 },
    );
  }

  const { id } = await params;
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "user_id required" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of ["title", "description", "category", "target", "progress", "status"]) {
    if (key in body) update[key] = body[key];
  }
  if (update.status === "completed") update.completed_at = new Date().toISOString();

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("user_goals")
      .update(update)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    if (!data)
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    return NextResponse.json({ goal: data });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}

/** DELETE /api/goals/[id] — remove a goal. */
export async function DELETE(req: NextRequest, { params }: Params) {
  if (!isServerSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 },
    );
  }

  const { id } = await params;
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "user_id required" }, { status: 400 });
  }

  try {
    const { error } = await getSupabaseAdmin()
      .from("user_goals")
      .delete()
      .eq("id", id)
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
