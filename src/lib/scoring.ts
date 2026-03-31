interface Response { questionId: number; responseType: string; responseText?: string; responseChoice?: string | string[] | number; }
interface ScoringResult { primaryArchetypeId: number; primaryScore: number; secondaryArchetypeId: number; secondaryScore: number; allScores: Record<number, number>; }

export function calculateArchetypeScores(responses: Response[]): ScoringResult {
  const scores: Record<number, number> = {};
  for (let i = 1; i <= 10; i++) scores[i] = 0;

  for (const r of responses) {
    const v = r.responseChoice;
    switch (r.questionId) {
      // Q1: Morning routine
      case 1: {
        if (v === "early_routine") { scores[2] += 2; scores[10] += 2; }
        if (v === "slow_mornings") { scores[10] += 2; scores[6] += 1; }
        if (v === "passion_first") { scores[2] += 3; scores[4] += 1; }
        if (v === "not_morning") { scores[5] += 3; }
        if (v === "easier_then") { scores[7] += 2; scores[1] += 1; }
        break;
      }
      // Q2: Free time
      case 2: {
        if (v === "movement") { scores[2] += 3; }
        if (v === "social") { scores[4] += 3; }
        if (v === "creative") { scores[10] += 2; scores[9] += 1; }
        if (v === "curious") { scores[10] += 2; }
        if (v === "relax") { scores[8] += 1; scores[5] += 1; }
        if (v === "mix") { scores[10] += 1; scores[2] += 1; scores[4] += 1; }
        break;
      }
      // Q3: How you recharged
      case 3: {
        if (v === "A") { scores[2] += 3; scores[10] += 1; }
        if (v === "B") { scores[4] += 3; scores[3] += 1; }
        if (v === "C") { scores[5] += 2; scores[10] += 2; }
        if (v === "D") { scores[10] += 2; scores[9] += 1; }
        if (v === "E") { scores[10] += 1; scores[2] += 1; scores[4] += 1; }
        break;
      }
      // Q4: Consistency style
      case 4: {
        if (v === "A") scores[10] += 3;
        if (v === "B") { scores[9] += 3; scores[1] += 1; }
        if (v === "C") scores[4] += 3;
        if (v === "D") { scores[2] += 2; scores[3] += 2; }
        break;
      }
      // Q5: What you stopped
      case 5: {
        if (v === "exercise") { scores[2] += 3; }
        if (v === "cooking") { scores[6] += 2; scores[8] += 1; }
        if (v === "reading") { scores[5] += 1; scores[10] += 1; }
        if (v === "friends") { scores[4] += 2; scores[3] += 1; }
        if (v === "creative") { scores[10] += 2; }
        if (v === "walking") { scores[2] += 1; scores[10] += 1; }
        if (v === "self_care") { scores[1] += 2; scores[3] += 1; }
        if (v === "sleep") { scores[5] += 2; scores[1] += 1; }
        break;
      }
      // Q6: Protected part of day
      case 6: {
        if (v === "mornings") { scores[2] += 1; scores[10] += 2; }
        if (v === "workouts") { scores[2] += 3; }
        if (v === "meals") { scores[6] += 1; scores[10] += 1; }
        if (v === "evenings") { scores[5] += 2; }
        if (v === "people") { scores[4] += 2; scores[3] += 1; }
        if (v === "flowed") { scores[7] += 2; }
        break;
      }
      // Q7: Current feeling
      case 7: {
        if (v === "A") scores[10] += 2;
        if (v === "B") { scores[1] += 3; scores[9] += 1; }
        if (v === "C") { scores[3] += 3; scores[6] += 2; }
        if (v === "D") { scores[7] += 3; scores[6] += 1; }
        if (v === "E") { scores[10] += 2; scores[2] += 1; }
        break;
      }
      // Q8: Identity tied to career (slider)
      case 8: {
        const val = v as number;
        if (val >= 75) scores[1] += 3;
        else if (val >= 50) { scores[1] += 2; scores[9] += 1; }
        else if (val <= 25) { scores[4] += 2; scores[2] += 1; }
        break;
      }
      // Q9: Last time did something for joy
      case 9: {
        if (v === "A") scores[10] += 2;
        if (v === "B") { scores[1] += 1; scores[4] += 1; }
        if (v === "C") { scores[1] += 2; scores[6] += 2; }
        if (v === "D") { scores[6] += 3; scores[9] += 2; }
        break;
      }
      // Q10: What you reach for when stressed
      case 10: {
        if (v === "phone") { scores[5] += 3; scores[8] += 1; }
        if (v === "food") { scores[6] += 3; scores[8] += 2; }
        if (v === "shopping") { scores[7] += 1; scores[4] += 1; }
        if (v === "tv") { scores[5] += 2; scores[8] += 1; }
        if (v === "substances") { scores[6] += 2; scores[5] += 1; }
        if (v === "work") { scores[1] += 3; scores[9] += 1; }
        if (v === "shutdown") { scores[3] += 2; scores[6] += 1; }
        break;
      }
      // Q11: Patterns (multi-select)
      case 11: {
        const vals = v as string[];
        if (vals?.includes("busier_less_self")) { scores[1] += 2; scores[3] += 1; }
        if (vals?.includes("know_dont_do")) { scores[7] += 2; scores[9] += 2; }
        if (vals?.includes("stopped_without_deciding")) { scores[2] += 2; scores[7] += 1; }
        if (vals?.includes("phone_checking")) { scores[5] += 2; scores[8] += 1; }
        if (vals?.includes("performing_self")) { scores[1] += 2; scores[4] += 1; }
        if (vals?.includes("night_different")) { scores[5] += 2; scores[6] += 2; scores[8] += 1; }
        break;
      }
      // Q12: Time of day feeling most like self
      case 12: {
        if (v === "A") { scores[2] += 1; scores[10] += 1; }
        if (v === "C") scores[5] += 2;
        if (v === "D") { scores[6] += 2; scores[7] += 1; scores[1] += 1; }
        break;
      }
      // Q13: Version of yourself you miss
      case 13: {
        if (v === "active_self") { scores[2] += 3; }
        if (v === "creative_self") { scores[10] += 2; scores[7] += 1; }
        if (v === "present_self") { scores[5] += 2; scores[8] += 1; }
        if (v === "confident_self") { scores[1] += 1; scores[9] += 2; }
        if (v === "social_self") { scores[4] += 2; scores[3] += 1; }
        if (v === "something_off") { scores[7] += 2; scores[6] += 1; }
        break;
      }
      // Q14: What's different now
      case 14: {
        if (v === "work_took_over") { scores[1] += 3; }
        if (v === "life_change") { scores[7] += 2; scores[3] += 1; }
        if (v === "relationships") { scores[3] += 3; }
        if (v === "gradual_drift") { scores[7] += 2; scores[8] += 1; }
        if (v === "body_changed") { scores[2] += 2; scores[6] += 1; }
        if (v === "mental_health") { scores[6] += 2; scores[1] += 1; }
        break;
      }
    }
  }

  const sorted = Object.entries(scores).map(([id, score]) => ({ id: Number(id), score })).sort((a, b) => b.score - a.score);
  return { primaryArchetypeId: sorted[0].id, primaryScore: sorted[0].score, secondaryArchetypeId: sorted[1].id, secondaryScore: sorted[1].score, allScores: scores };
}

export function generateGoalSuggestions(archetypeId: number, responses: Response[]): string[] {
  const g: Record<number, string[]> = {
    1: ["Protect your mornings — even 20 minutes before the day takes over", "Leave work at a set time at least 3 days this week", "Eat one meal that isn't at your desk", "Put your phone in another room before sleep"],
    2: ["Move your body before 7pm — not for fitness, for how it makes tomorrow feel", "Try one new form of movement", "Listen to your body's recovery signals", "Eat for who you are now, not who you were"],
    3: ["Take 15 minutes this week that are purely yours", "Eat one meal you chose for yourself", "Ask for help with one thing", "Move your body for 10 minutes"],
    4: ["Say no to one social event this week", "Before saying yes, ask: do I actually want this?", "Eat one meal at home, by choice", "Notice when you're matching someone else's pace"],
    5: ["Put your phone down an hour before sleep", "Set a wind-down alarm at 10pm", "Eat your last meal before 9pm at least 3 days", "Find one thing to do between 10-11pm that isn't a screen"],
    6: ["Before you eat, pause and ask: am I hungry, or feeling something?", "Find one non-food comfort", "Eat one meal the old you would recognize", "When the craving hits, wait 10 minutes"],
    7: ["Pick one thing and do it for 7 days straight", "Don't research a new program this week", "The goal isn't perfection. It's still being here on day 8.", "Celebrate consistency, not intensity"],
    8: ["Before you snack, drink water and wait 5 minutes", "Eat at the table, not standing or at your desk", "Notice when you're eating without choosing to", "Keep one area of your home snack-free"],
    9: ["When you slip, don't restart — just continue", "Replace 'I ruined it' with 'I'm learning'", "Track progress in weeks, not days", "Be kind to yourself when things aren't perfect"],
    10: ["Spend one evening the way your past self would have", "Go deeper on one habit instead of wider", "Share your journey with someone", "Notice what disrupts your consistency"],
  };
  const goals = [...(g[archetypeId] || g[10])];

  // Add contextual goals based on Q10 answer
  const q10 = responses.find((r) => r.questionId === 10);
  if (q10?.responseChoice === "phone") goals.push("Before opening your go-to app, ask: is this what I actually want right now?");
  if (q10?.responseChoice === "food") goals.push("Next time the craving comes, set a timer for 3 minutes.");
  if (q10?.responseChoice === "shopping") goals.push("Add it to a 48-hour wishlist instead of buying now.");

  return goals.slice(0, 6);
}
