/**
 * Harold & Crew mascot registry.
 *
 * Four mascots — Harold (pink heart), Blue (gorilla), White (lion),
 * Yellow (cloud) — each with a palette of moods. Files live in
 * `/public/mascots/` with the exact filenames listed below.
 *
 * Import `<MascotImage name="..." />` to render one; missing files
 * silently fall back to the base Harold image so layout never breaks.
 */

export type Mascot = "harold" | "blue" | "white" | "yellow";

export type Mood =
  | "happy"
  | "peaceful"
  | "sad"
  | "angry"
  | "cry"
  | "worried"
  | "tired"
  | "calm"
  | "love";

/** All mascot/mood combinations that exist on disk. */
export type MascotName =
  | "harold"
  | "harold-happy"
  | "harold-peaceful"
  | "harold-sad"
  | "harold-angry"
  | "harold-love"
  | "blue-happy"
  | "blue-peaceful"
  | "blue-cry"
  | "blue-angry"
  | "blue-worried"
  | "white-happy"
  | "white-peaceful"
  | "white-cry"
  | "white-angry"
  | "white-worried"
  | "white-calm"
  | "yellow-happy"
  | "yellow-peaceful"
  | "yellow-sad"
  | "yellow-cry"
  | "yellow-angry"
  | "yellow-tired";

const SOURCES: Record<MascotName, string> = {
  harold: "/mascots/harold.png",
  "harold-happy": "/mascots/harold-happy.png",
  "harold-peaceful": "/mascots/harold-peaceful.png",
  "harold-sad": "/mascots/harold-sad.png",
  "harold-angry": "/mascots/harold-angry.png",
  "harold-love": "/mascots/harold-love.png",
  "blue-happy": "/mascots/blue-happy.png",
  "blue-peaceful": "/mascots/blue-peaceful.png",
  "blue-cry": "/mascots/blue-cry.png",
  "blue-angry": "/mascots/blue-angry.png",
  "blue-worried": "/mascots/blue-worried.png",
  "white-happy": "/mascots/white-happy.png",
  "white-peaceful": "/mascots/white-peaceful.png",
  "white-cry": "/mascots/white-cry.png",
  "white-angry": "/mascots/white-angry.png",
  "white-worried": "/mascots/white-worried.png",
  "white-calm": "/mascots/white-calm.png",
  "yellow-happy": "/mascots/yellow-happy.png",
  "yellow-peaceful": "/mascots/yellow-peaceful.png",
  "yellow-sad": "/mascots/yellow-sad.png",
  "yellow-cry": "/mascots/yellow-cry.png",
  "yellow-angry": "/mascots/yellow-angry.png",
  "yellow-tired": "/mascots/yellow-tired.png",
};

/** Resolve a mascot name to a public path. */
export function mascot(name: MascotName): string {
  return SOURCES[name];
}

/** The crew trio shown in the landing top-left. */
export const CREW_LINEUP: MascotName[] = [
  "harold-peaceful",
  "yellow-peaceful",
  "white-peaceful",
];

/** The crew trio shown around the archetype reveal. */
export const ARCHETYPE_LINEUP: MascotName[] = [
  "yellow-peaceful",
  "blue-angry",
  "white-peaceful",
];

/** Map an archetype ID to the mascot + mood that represents them. */
export const ARCHETYPE_MASCOT: Record<number, MascotName> = {
  1: "harold-sad", // Burnt-Out Professional
  2: "blue-angry", // Driven Drifter
  3: "white-calm", // Selfless Anchor
  4: "yellow-happy", // Social Butterfly
  5: "blue-worried", // Night Owl
  6: "harold-love", // Comfort Seeker
  7: "yellow-tired", // Serial Starter
  8: "yellow-sad", // Mindless Grazer
  9: "harold-angry", // Perfectionist Quitter
  10: "white-peaceful", // Mindful Aspirant
};

/** Pick a Harold mood that matches how the day is trending. */
export function haroldForMood(
  tone: "steady" | "off" | "stressed",
): MascotName {
  if (tone === "steady") return "harold-happy";
  if (tone === "stressed") return "harold-sad";
  return "harold-peaceful";
}
