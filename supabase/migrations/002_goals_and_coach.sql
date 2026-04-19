-- Goals + coach conversations
-- Run in Supabase SQL Editor → New Query

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USER GOALS
-- ============================================================
CREATE TABLE IF NOT EXISTS user_goals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  category text,
  target int NOT NULL DEFAULT 1,
  progress int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','paused','completed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_user_goals_user ON user_goals(user_id, status);

-- ============================================================
-- COACH CONVERSATIONS — every message Harold and the user exchange
-- ============================================================
CREATE TABLE IF NOT EXISTS coach_conversations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('user','assistant','system')),
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coach_conv_user_time
  ON coach_conversations(user_id, created_at DESC);

-- ============================================================
-- DAILY ACTIVITY SUMMARY view (used by /api/dashboard)
-- ============================================================
CREATE OR REPLACE VIEW user_daily_activity AS
SELECT
  user_id,
  DATE(attended_at) AS day,
  COUNT(*) AS attended_count
FROM user_activities
WHERE status = 'attended' AND attended_at IS NOT NULL
GROUP BY user_id, DATE(attended_at);

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_goals_owner ON user_goals
  USING (user_id::text = auth.uid()::text)
  WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY coach_conv_owner ON coach_conversations
  USING (user_id::text = auth.uid()::text)
  WITH CHECK (user_id::text = auth.uid()::text);
