-- Vlastním tempem - Core Database Schema

-- ENUMs
CREATE TYPE user_account_type AS ENUM ('individual', 'organization');
CREATE TYPE user_role AS ENUM ('osoba_s_postizenim', 'pecujici', 'organizace', 'admin');
CREATE TYPE severity_level AS ENUM ('lehka', 'stredni', 'tezsi');
CREATE TYPE difficulty_level AS ENUM ('lehka', 'stredni', 'tezsi');
CREATE TYPE exercise_status AS ENUM ('generated', 'awaiting_review', 'approved', 'rejected', 'archived');
CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'expired', 'cancelled');
CREATE TYPE subscription_tier AS ENUM ('individual', 'institutional');
CREATE TYPE batch_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  account_type user_account_type NOT NULL DEFAULT 'individual',
  role user_role NOT NULL DEFAULT 'pecujici',
  severity_level severity_level,
  organization_name TEXT,
  contact_info TEXT,
  free_workbook_used BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Assessment Responses
CREATE TABLE assessment_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  q1 SMALLINT NOT NULL CHECK (q1 BETWEEN 1 AND 3),
  q2 SMALLINT NOT NULL CHECK (q2 BETWEEN 1 AND 3),
  q3 SMALLINT NOT NULL CHECK (q3 BETWEEN 1 AND 3),
  q4 SMALLINT NOT NULL CHECK (q4 BETWEEN 1 AND 3),
  q5 SMALLINT NOT NULL CHECK (q5 BETWEEN 1 AND 3),
  q6 SMALLINT NOT NULL CHECK (q6 BETWEEN 1 AND 3),
  q7 SMALLINT NOT NULL CHECK (q7 BETWEEN 1 AND 3),
  average_score NUMERIC(3,2) NOT NULL,
  computed_severity severity_level NOT NULL,
  is_current BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_assessment_user_current ON assessment_responses(user_id, is_current);

-- Themes
CREATE TABLE themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  cover_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cognitive Tags
CREATE TABLE cognitive_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  label_cs TEXT NOT NULL
);

-- Generation Batches
CREATE TABLE generation_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id UUID NOT NULL REFERENCES themes(id),
  difficulty difficulty_level NOT NULL,
  cognitive_tag_ids UUID[] NOT NULL DEFAULT '{}',
  count INTEGER NOT NULL DEFAULT 1,
  prompt_text TEXT NOT NULL,
  prompt_image TEXT,
  status batch_status NOT NULL DEFAULT 'pending',
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Exercises
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id UUID NOT NULL REFERENCES themes(id),
  difficulty difficulty_level NOT NULL,
  status exercise_status NOT NULL DEFAULT 'generated',
  text_content TEXT NOT NULL,
  image_url TEXT,
  batch_id UUID REFERENCES generation_batches(id),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_exercises_theme_diff_status ON exercises(theme_id, difficulty, status);

-- Exercise Tags (junction)
CREATE TABLE exercise_tags (
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES cognitive_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (exercise_id, tag_id)
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  tier subscription_tier NOT NULL,
  status subscription_status NOT NULL DEFAULT 'inactive',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);

-- Workbooks
CREATE TABLE workbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  theme_id UUID NOT NULL REFERENCES themes(id),
  difficulty difficulty_level NOT NULL,
  pdf_url TEXT NOT NULL,
  seed INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_workbooks_user ON workbooks(user_id);

-- Workbook Exercises (junction with order)
CREATE TABLE workbook_exercises (
  workbook_id UUID NOT NULL REFERENCES workbooks(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id),
  position SMALLINT NOT NULL CHECK (position BETWEEN 1 AND 10),
  PRIMARY KEY (workbook_id, exercise_id)
);

-- Error Logs
CREATE TABLE error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID REFERENCES generation_batches(id),
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  request_payload JSONB,
  retryable BOOLEAN NOT NULL DEFAULT TRUE,
  retried BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
