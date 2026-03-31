interface Response { questionId: number; responseType: string; responseText?: string; responseChoice?: string | string[] | number; }
interface ScoringResult { primaryArchetypeId: number; primaryScore: number; secondaryArchetypeId: number; secondaryScore: number; allScores: Record<number, number>; }

const keywordMap: Record<string, number[]> = {
  running: [2], gym: [2], workout: [2], sport: [2], athlete: [2], fitness: [2], exercise: [2],
  kids: [3], children: [3], family: [3], parent: [3], baby: [3],
  deadline: [1], meeting: [1], work: [1], office: [1], career: [1], overtime: [1],
  friends: [4], party: [4], dinner: [4], drinks: [4], social: [4],
  night: [5], late: [5], midnight: [5], scroll: [5], gaming: [5],
  comfort: [6], stress: [6], emotional: [6], binge: [6], snack: [6, 8], crave: [6],
  diet: [7], restart: [7, 9], motivation: [7],
  pantry: [8], nibble: [8], bored: [8], mindless: [8],
  perfect: [9], fail: [9], strict: [9],
  meditation: [10], mindful: [10], yoga: [10], balance: [10], journal: [10],
  phone: [5, 8], instagram: [5], tiktok: [5],
};

function scoreText(text: string): Record<number, number> {
  const scores: Record<number, number> = {};
  const lower = text.toLowerCase();
  for (const [kw, ids] of Object.entries(keywordMap)) {
    if (lower.includes(kw)) { for (const id of ids) { scores[id] = (scores[id] || 0) + 1.5; } }
  }
  return scores;
}

export function calculateArchetypeScores(responses: Response[]): ScoringResult {
  const scores: Record<number, number> = {};
  for (let i = 1; i <= 10; i++) scores[i] = 0;
  for (const r of responses) {
    switch (r.questionId) {
      case 3: { const v = r.responseChoice as string; if (v==="A"){scores[2]+=3;scores[10]+=1;} if(v==="B"){scores[4]+=3;scores[3]+=1;} if(v==="C"){scores[5]+=2;scores[10]+=2;} if(v==="D"){scores[10]+=2;scores[9]+=1;} if(v==="E"){scores[10]+=1;scores[2]+=1;scores[4]+=1;} break; }
      case 4: { const v = r.responseChoice as string; if(v==="A")scores[10]+=3; if(v==="B"){scores[9]+=3;scores[1]+=1;} if(v==="C")scores[4]+=3; if(v==="D"){scores[2]+=2;scores[3]+=2;} break; }
      case 7: { const v = r.responseChoice as string; if(v==="A")scores[10]+=2; if(v==="B"){scores[1]+=3;scores[9]+=1;} if(v==="C"){scores[3]+=3;scores[6]+=2;} if(v==="D"){scores[7]+=3;scores[6]+=1;} if(v==="E"){scores[10]+=2;scores[2]+=1;} break; }
      case 8: { const v = r.responseChoice as number; if(v>=75)scores[1]+=3; else if(v>=50){scores[1]+=2;scores[9]+=1;} else if(v<=25){scores[4]+=2;scores[2]+=1;} break; }
      case 9: { const v = r.responseChoice as string; if(v==="A")scores[10]+=2; if(v==="B"){scores[1]+=1;scores[4]+=1;} if(v==="C"){scores[1]+=2;scores[6]+=2;} if(v==="D"){scores[6]+=3;scores[9]+=2;} break; }
      case 11: { const vals = r.responseChoice as string[]; if(vals.includes("busier_less_self")){scores[1]+=2;scores[3]+=1;} if(vals.includes("know_dont_do")){scores[7]+=2;scores[9]+=2;} if(vals.includes("stopped_without_deciding")){scores[2]+=2;scores[7]+=1;} if(vals.includes("phone_checking")){scores[5]+=2;scores[8]+=1;} if(vals.includes("performing_self")){scores[1]+=2;scores[4]+=1;} if(vals.includes("night_different")){scores[5]+=2;scores[6]+=2;scores[8]+=1;} break; }
      case 12: { const v = r.responseChoice as string; if(v==="A"){scores[2]+=1;scores[10]+=1;} if(v==="C")scores[5]+=2; if(v==="D"){scores[6]+=2;scores[7]+=1;scores[1]+=1;} break; }
      case 1: case 2: case 5: case 6: case 10: case 13: case 14: { if(r.responseText){const ts=scoreText(r.responseText); for(const[id,s]of Object.entries(ts)){scores[Number(id)]+=s;}} break; }
    }
  }
  const sorted = Object.entries(scores).map(([id,score])=>({id:Number(id),score})).sort((a,b)=>b.score-a.score);
  return { primaryArchetypeId: sorted[0].id, primaryScore: sorted[0].score, secondaryArchetypeId: sorted[1].id, secondaryScore: sorted[1].score, allScores: scores };
}

export function generateGoalSuggestions(archetypeId: number, responses: Response[]): string[] {
  const g: Record<number, string[]> = {
    1: ["Protect your mornings \u2014 even 20 minutes before the day takes over", "Leave work at a set time at least 3 days this week", "Eat one meal that isn't at your desk", "Put your phone in another room before sleep"],
    2: ["Move your body before 7pm \u2014 not for fitness, for how it makes tomorrow feel", "Try one new form of movement", "Listen to your body's recovery signals", "Eat for who you are now, not who you were"],
    3: ["Take 15 minutes this week that are purely yours", "Eat one meal you chose for yourself", "Ask for help with one thing", "Move your body for 10 minutes"],
    4: ["Say no to one social event this week", "Before saying yes, ask: do I actually want this?", "Eat one meal at home, by choice", "Notice when you're matching someone else's pace"],
    5: ["Put your phone down an hour before sleep", "Set a wind-down alarm at 10pm", "Eat your last meal before 9pm at least 3 days", "Find one thing to do between 10-11pm that isn't a screen"],
    6: ["Before you eat, pause and ask: am I hungry, or feeling something?", "Find one non-food comfort", "Eat one meal the old you would recognize", "When the craving hits, wait 10 minutes"],
    7: ["Pick one thing and do it for 7 days straight", "Don't research a new program this week", "The goal isn't perfection. It's still being here on day 8.", "Celebrate consistency, not intensity"],
    8: ["Before you snack, drink water and wait 5 minutes", "Eat at the table, not standing or at your desk", "Notice when you're eating without choosing to", "Keep one area of your home snack-free"],
    9: ["When you slip, don't restart \u2014 just continue", "Replace 'I ruined it' with 'I'm learning'", "Track progress in weeks, not days", "Be kind to yourself when things aren't perfect"],
    10: ["Spend one evening the way your past self would have", "Go deeper on one habit instead of wider", "Share your journey with someone", "Notice what disrupts your consistency"],
  };
  const goals = [...(g[archetypeId] || g[10])];
  const q10 = responses.find((r) => r.questionId === 10);
  if (q10?.responseText) {
    const t = q10.responseText.toLowerCase();
    if (t.includes("phone") || t.includes("scroll")) goals.push("Before opening your go-to app, ask: is this what I actually want right now?");
    if (t.includes("food") || t.includes("eat") || t.includes("snack")) goals.push("Next time the craving comes, set a timer for 3 minutes.");
  }
  return goals.slice(0, 6);
}
