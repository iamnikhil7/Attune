# PAUSE — Product Requirements Document (PRD)

## 1. Overview

**PAUSE** is a behavioral intelligence application that passively monitors user signals across seven categories (movement, nutrition, screen time, spending, sleep, social activity, work stress), detects vulnerability moments using a context engine, and delivers a signature three-layer pause interaction to help users resist unwanted habits. The core philosophy: mirrors not blocks, zero shame, identity-anchored interventions.

**Live URL:** Deployed on Vercel (auto-deploys from GitHub main branch)
**Repository:** github.com/iamnikhil7/pause-app
**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS, Supabase (Auth + PostgreSQL + Realtime + Storage), Vercel

---

## 2. Problem Statement

People don't lack knowledge about what they should do — they lack awareness at the exact moment they need it. Existing health and wellness apps focus on tracking metrics (calories, steps, screen time) and use guilt-based notifications to drive behavior change. This approach fails because:

- It treats symptoms, not patterns
- It relies on willpower, which depletes
- It shames users when they fail, creating shame spirals
- It's generic, ignoring individual identity and context
- It intervenes at the wrong moments

PAUSE solves this by creating a **moment of awareness** — using the user's own words — at the precise moment they're most vulnerable to their habits.

---

## 3. Target Users

Adults (22-45) who:
- Have experienced "identity drift" — they've slowly become someone they don't fully recognize
- Know what they should do but consistently don't do it
- Have a graveyard of abandoned health/wellness apps
- Notice their worst decisions happen at predictable times (late night, after stressful days, weekends)
- Want change but are exhausted by systems that require constant willpower

---

## 4. Identity Archetypes (10 User Personas)

Each user is assigned one of 10 archetypes via a scoring algorithm based on their questionnaire responses:

| # | Archetype | Wellness Baseline | Core Pattern |
|---|-----------|------------------|--------------|
| 1 | The Burnt-Out Professional | 55% | Overworked, stress-eating, delivery app dependency |
| 2 | The Former Athlete | 65% | Identity tied to past fitness, declining without noticing |
| 3 | The Overwhelmed Parent | 50% | Self-sacrifice, convenience eating, zero personal time |
| 4 | The Social Butterfly | 60% | FOMO-driven, peer pressure, weekend warrior |
| 5 | The Night Owl | 58% | Late-night bad decisions, reversed schedule, scrolling |
| 6 | The Emotional Eater | 52% | Food as comfort/reward, stress-snacking cycles |
| 7 | The Serial Starter | 55% | Starts strong, abandons fast, program-hopping |
| 8 | The Mindless Grazer | 57% | Constant nibbling, boredom eating, no awareness |
| 9 | The Perfectionist Quitter | 53% | All-or-nothing, one slip ruins everything |
| 10 | The Mindful Aspirant | 70% | Already aware, needs tools for consistency |

---

## 5. User Journey

### Phase 1: Entry & Authentication
- Single landing page with "Get Started" CTA
- **Anonymous-first:** User starts the questionnaire without creating an account
- Anonymous session created via Supabase Auth
- Optional account creation (email/password) deferred until after onboarding
- Returning users: standard email/password login

### Phase 2: Safety Gate
- Before any questions, a sensitivity check screen appears
- If user indicates sensitivity around food/body image → app switches to ED-aware mode with softer language throughout the entire experience
- Stored as `sensitivity_mode` boolean

### Phase 3: Onboarding Questionnaire (14 Questions)

**Part 1 — "Who Were You?" (Q1-Q7)**
Reconstructs the user's past identity, routines, and relationship with themselves. Questions are indirect — they surface health patterns without asking about health directly.

- Q1: Typical morning when you felt most like yourself (open text)
- Q2: What you genuinely chose to do with free time (open text)
- Q3: How you used to recharge (single choice: movement/social/quiet/creating/mix)
- Q4: What consistency felt like (single choice: effortless/disciplined/social/environmental)
- Q5: Something you've quietly stopped doing (open text)
- Q6: Part of your routine you were most protective of (open text)
- Q7: First feeling about your average Tuesday now (single choice: busy/hollow/tired/lost/adapting)

**Part 2 — "Who Are You Now?" (Q8-Q14)**
Surfaces structural drift, current patterns, and relationship with time and identity.

- Q8: Identity tied to career (slider 0-100)
- Q9: Last time you did something purely for joy (single choice)
- Q10: First thing you reach for when stressed (open text)
- Q11: Patterns you recognize in yourself (multi-select, 6 options)
- Q12: Time of day you feel most like yourself (single choice)
- Q13: Version of yourself you miss (open text)
- Q14: What's genuinely different now (open text)

### Phase 4: Archetype Scoring & Goal Generation
- Deterministic scoring algorithm maps responses to archetype weights
- Open text responses analyzed via NLP keyword extraction
- Primary + secondary archetypes assigned
- 4-6 personalized goal suggestions generated (identity anchors, not metrics)
- User writes their "personal why" — sacred text shown during every pause intervention

### Phase 5: Archetype Reveal
- Animated reveal screen with archetype name, description, wellness baseline ring, key traits, goals, and personal why

### Phase 6: Priority Selection
User selects 1-3 priority areas:
- **Physical Health** — movement, fitness, recovery
- **Nutritional Health** — eating patterns, delivery habits, grocery intelligence
- **Digital Wellness** — screen time, scrolling, phone dependency

### Phase 7: Passive Observation (7 days)
- App learns patterns silently before any intervention
- Dashboard shows observation progress
- Signal categories begin collecting data
- NO interceptions during this phase

### Phase 8: Active Intervention — The Three-Layer Pause
When the context engine detects a recurring vulnerability pattern:

**Layer 1 — Cooldown (30-45 seconds)**
- Mandatory, unskippable pause
- Full-screen calming animation
- Creates space between impulse and action

**Layer 2 — Your Why**
- User's own words displayed
- Contextual data (e.g., "You've ordered this 6 times this month")
- Deeply personal — hits differently than generic messages

**Layer 3 — Witness Nudge**
- ONLY for repeat overrides of the same pattern
- Silent acknowledgment, zero judgment

### Phase 9: Response & Adaptation
- **Resisted:** Avatar glows, identity reinforced, points earned
- **Overrode:** Completely neutral response, optional reason logging
- **Snoozed:** Shows up once more later (physical health only)
- **Modified:** Counts as a win (nutritional health only)
- Every response feeds the context engine for smarter future interventions

### Phase 10: Graduation
- 30 consecutive days + 200 points = graduation from a habit
- Can add new habits to work on
- Ambient sensing continues indefinitely

---

## 6. Technical Architecture

### Frontend
- **Next.js 16** with App Router, TypeScript, Tailwind CSS
- Server-side rendering for landing page (SEO)
- Client-side rendering for app pages (dynamic state)

### Backend & Database
- **Supabase** PostgreSQL with Row-Level Security (RLS)
- Supabase Auth (anonymous-first, email/password, OAuth-ready)
- Supabase Realtime for live widget/avatar updates
- Supabase Storage for avatar assets

### Deployment
- **Vercel** auto-deploys from GitHub main branch
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 7. Database Schema (25+ tables)

### Core
- `users` — id, anonymous_id, email, personal_why, sensitivity_mode, onboarding_completed, account_linked
- `user_settings` — sensitivity_mode, notification_preferences, observation_period_days
- `onboarding_responses` — user_id, question_id, question_part, response_type, response_text, response_choice
- `user_goals` — goal_text, is_system_generated, is_active

### Archetypes
- `archetypes` — name, description, wellness_baseline, key_traits, trigger_points, avatar_config (10 seeded)
- `user_archetypes` — user_id, archetype_id, primary_score, secondary_archetype_id, secondary_score
- `archetype_scoring_rules` — question_id, response_value, archetype_id, weight

### Priorities & Apps
- `user_priorities` — priority_type (physical_health | nutritional_health | digital_wellness)
- `connected_apps` — app_name, app_type, tag (trigger | watch | safe), oauth_token
- `user_app_flags` — flagged problem apps

### Signals & Sensing
- `signal_events` — signal_category (7 types), signal_type, signal_value, source_app
- `signal_baselines` — baseline_data per category
- `signal_patterns` — pattern_type, pattern_data, confidence_score

### Context Engine
- `vulnerability_assessments` — score (0-1), contributing_signals, goal_alignment, archetype_factor, time_context, decision

### Pause Events
- `pause_events` — trigger_signal, vulnerability_score, cooldown_duration, user_why_shown, witness_shown, outcome
- `pause_patterns` — pattern_signature, total_pauses, total_resisted, total_overridden

### Priority-Specific
- `nutrition_orders`, `nutrition_patterns`, `grocery_suggestions`
- `physical_health_suggestions`
- `screen_time_events`, `digital_vulnerability_moments`, `digital_suggestions`

### Progress
- `habit_progress` — total_pauses, total_resisted, current_streak, points, status (active | graduated | paused)
- `adaptation_log` — adaptation_type, details
- `user_observation_status` — started_at, completed_at, is_active

All tables have RLS enabled — users can only access their own data. Archetypes table is publicly readable.

---

## 8. API Endpoints Required

### Auth
- `POST /auth/anonymous` — create anonymous session
- `POST /auth/register` — link email/password
- `POST /auth/login` — standard login

### Onboarding
- `POST /onboarding/sensitivity-check`
- `POST /onboarding/response` — save question response
- `GET /onboarding/progress`
- `POST /onboarding/generate-goals`
- `PUT /onboarding/goals`
- `POST /onboarding/personal-why`
- `GET /onboarding/archetype`

### Priorities & Apps
- `POST /priorities`
- `POST /apps/connect`
- `PUT /apps/:id/tag`

### Signals & Context
- `POST /signals/ingest`
- `GET /signals/baseline/:category`
- `GET /vulnerability/current`

### Pause
- `POST /pause/trigger`
- `POST /pause/:id/respond`
- `GET /pause/history`

### Progress
- `GET /progress`
- `POST /graduation/:habit_type`

---

## 9. Background Jobs

1. **SignalIngestionWorker** — polls connected apps on schedule
2. **BaselineComputeWorker** — daily baseline computation
3. **PatternDetectionWorker** — hourly pattern analysis
4. **ContextEngineWorker** — every 5 min vulnerability scoring
5. **InterceptionDecisionWorker** — evaluates scores, triggers pauses
6. **SuggestionGeneratorWorker** — personalized suggestions
7. **AdaptationWorker** — weekly friction/timing adjustment
8. **GroceryIntelligenceWorker** — post-purchase suggestions
9. **GraduationCheckWorker** — daily graduation criteria check
10. **WidgetUpdateWorker** — avatar state changes

---

## 10. Critical Rules

1. No interception during observation phase (7 days)
2. Pattern-based, not event-based — minimum 3 occurrences before first interception
3. Context check before EVERY interception — rare occasions get no intercept
4. User's "why" is sacred — display exactly as written, never edit
5. Override = zero shame — completely neutral UX
6. Every response feeds the engine
7. Suggestions are the smallest possible action
8. Timing is personalized based on observed patterns
9. ED-sensitive mode flows through the entire app
10. Witness nudge (Layer 3) only appears for repeat overrides
11. Graduation requires 30 days + 200 points
12. Friction adapts dynamically — more for entrenched patterns, less for consistent resistance

---

## 11. Current Implementation Status

### Completed
- [x] Landing page with structured layout
- [x] Auth system (anonymous-first, email/password signup, login)
- [x] Full onboarding questionnaire (14 questions, sensitivity mode, both ED-aware variants)
- [x] Archetype scoring algorithm with NLP keyword extraction
- [x] Goal suggestion engine (personalized per archetype + responses)
- [x] "Your Why" capture
- [x] Archetype reveal screen with wellness ring
- [x] Priority selection (Physical, Nutritional, Digital)
- [x] Dashboard with observation phase progress
- [x] Complete database schema (25+ tables, RLS, indexes, 10 archetypes seeded)
- [x] Account linking for anonymous users post-onboarding
- [x] Vercel deployment with auto-deploy from main

### To Build
- [ ] The Three-Layer Pause interaction (core UX)
- [ ] App connection page with OAuth flows
- [ ] Signal ingestion pipeline
- [ ] Context engine + vulnerability scoring
- [ ] Physical Health priority flow
- [ ] Nutritional Health priority flow + grocery intelligence
- [ ] Digital Wellness priority flow
- [ ] Avatar system (SVG/Lottie, 4 states per archetype)
- [ ] Homescreen widget
- [ ] Suggestion engine + adaptation logic
- [ ] Long-term pattern decoding
- [ ] Graduation system + points
- [ ] Background workers

---

## 12. Success Metrics

- **Activation:** % of users who complete onboarding
- **Engagement:** Average pauses per user per week
- **Resistance rate:** % of pauses where user resisted
- **Retention:** 7-day, 30-day return rates
- **Graduation:** % of users who graduate from at least one habit
- **Override trend:** Decreasing override rate over time per pattern
- **NPS:** User satisfaction score
