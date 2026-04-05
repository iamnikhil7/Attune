import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

/** POST /api/health/check-in — save a manual daily check-in */
export async function POST(req: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const body = await req.json();
  const { user_id, sleep_quality, sleep_hours, energy_level, stress_level, movement, mood, notes } = body;

  if (!user_id) {
    return NextResponse.json({ error: "user_id required" }, { status: 400 });
  }

  const rhr = 60 + (stress_level * 4) - (sleep_quality * 2);
  const hrv = 70 - (stress_level * 8) + (sleep_quality * 4);
  const steps = movement === "none" ? 2000 : movement === "walking" ? 7000 : 5000;
  const activeMinutes = movement === "none" ? 5 : movement === "gym" ? 60 : 30;
  const stressScore = stress_level * 25;
  const orbState = stressScore > 60 ? "stressed" : stressScore > 30 ? "neutral" : "recovered";

  const reflectionMessage = generateReflection(sleep_quality, energy_level, stress_level, movement, mood);

  const { data: reflection, error } = await supabase
    .from("harold_reflections")
    .insert({ user_id, type: "check_in", message: reflectionMessage.message, detail: reflectionMessage.detail, orb_state: orbState })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    reflection,
    healthMetrics: { rhr, hrv, sleepHours: sleep_hours, sleepQuality: sleep_quality * 25, steps, activeMinutes, stressScore },
  });
}

function generateReflection(sleep: number, energy: number, stress: number, movement: string, mood: string) {
  if (stress >= 3 && sleep <= 1) return { message: "Stress is building and sleep isn\u2019t catching up.", detail: "When stress is high and sleep is low, things compound quietly. Even one good night could shift the trajectory." };
  if (sleep >= 3 && energy >= 3 && movement !== "none") return { message: "Good rhythm today. Harold can feel it.", detail: "Sleep was solid, energy was up, and you moved. When these three align, everything downstream gets easier." };
  if (energy <= 1 && movement === "none") return { message: "Your body has been quiet today.", detail: "Low energy and no movement often feed each other. Even a 10-minute walk can break the loop." };
  if (mood === "anxious" || mood === "frustrated") return { message: "Something\u2019s weighing on you.", detail: "Physical movement or social connection often helps more than thinking your way through it." };
  return { message: "Harold\u2019s watching. Quietly.", detail: "Today\u2019s check-in has been logged. Harold will look for patterns across your recent entries." };
}

export async function GET(req: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  const userId = req.nextUrl.searchParams.get("user_id");
  if (!userId) return NextResponse.json({ error: "user_id required" }, { status: 400 });
  const { data, error } = await supabase.from("harold_reflections").select("*").eq("user_id", userId).eq("type", "check_in").order("created_at", { ascending: false }).limit(14);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
