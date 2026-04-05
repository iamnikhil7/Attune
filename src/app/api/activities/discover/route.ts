import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { discoverActivities } from "@/lib/services/activity-discovery";

/** GET /api/activities/discover — fetch external activities from Meetup/Eventbrite */
export async function GET(req: NextRequest) {
  const location = req.nextUrl.searchParams.get("location") || "New York";
  const type = req.nextUrl.searchParams.get("type");
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "6");

  const activities = await discoverActivities({ location, type, limit });

  // Optionally sync discovered activities to Supabase
  if (isSupabaseConfigured() && activities.length > 0) {
    const toUpsert = activities.map((a) => ({
      name: a.name,
      slug: a.slug,
      type: a.type,
      description: a.description,
      atmosphere: a.atmosphere,
      timing: a.timing,
      location_name: a.location_name,
      source: a.source as "meetup" | "eventbrite",
      source_id: a.source_id,
      source_url: a.source_url,
      intensity: a.intensity as "low" | "moderate" | "high",
      active: true,
    }));

    await supabase.from("activities").upsert(toUpsert, { onConflict: "slug" }).select();
  }

  return NextResponse.json(activities);
}
