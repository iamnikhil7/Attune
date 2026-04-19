import { NextRequest, NextResponse } from "next/server";
import {
  getSupabaseAdmin,
  isServerSupabaseConfigured,
  getUserId,
} from "@/lib/supabase/server";
import { HAROLD_SYSTEM_PROMPT } from "@/lib/coach/system-prompt";

export const runtime = "nodejs";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * POST /api/coach
 * Body: { message: string, user_id?: string }
 * - Persists the user message
 * - Calls Anthropic with Harold's system prompt + recent history
 * - Persists Harold's reply
 * - Returns { reply: string }
 */
export async function POST(req: NextRequest) {
  let body: { message?: string; user_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const userId = body.user_id || getUserId(req);
  const message = body.message?.trim();
  if (!userId || !message) {
    return NextResponse.json(
      { error: "user_id and message are required" },
      { status: 400 },
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured on the server" },
      { status: 503 },
    );
  }

  const supabase = isServerSupabaseConfigured() ? getSupabaseAdmin() : null;
  let history: ChatMessage[] = [];

  if (supabase) {
    try {
      await supabase
        .from("coach_conversations")
        .insert({ user_id: userId, role: "user", content: message });

      const { data } = await supabase
        .from("coach_conversations")
        .select("role, content")
        .eq("user_id", userId)
        .in("role", ["user", "assistant"])
        .order("created_at", { ascending: false })
        .limit(20);

      history = (data ?? [])
        .reverse()
        .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));
    } catch (err) {
      console.error("[coach] supabase persist failed", err);
    }
  }

  if (history.length === 0) history = [{ role: "user", content: message }];

  let reply: string;
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        system: HAROLD_SYSTEM_PROMPT,
        messages: history,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Anthropic API error: ${text}` },
        { status: 502 },
      );
    }

    const data = (await res.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };
    reply =
      data.content?.find((b) => b.type === "text")?.text?.trim() ??
      "I'm here. Tell me a little more.";
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Coach request failed" },
      { status: 500 },
    );
  }

  if (supabase) {
    try {
      await supabase
        .from("coach_conversations")
        .insert({ user_id: userId, role: "assistant", content: reply });
    } catch (err) {
      console.error("[coach] supabase persist (assistant) failed", err);
    }
  }

  return NextResponse.json({ reply });
}
