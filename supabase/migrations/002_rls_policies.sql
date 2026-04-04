-- RLS Policies

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cognitive_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE workbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE workbook_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin can view all profiles" ON profiles FOR SELECT USING (is_admin());

-- Assessment Responses
CREATE POLICY "Users manage own assessments" ON assessment_responses FOR ALL USING (auth.uid() = user_id);

-- Themes (public read)
CREATE POLICY "Anyone can view themes" ON themes FOR SELECT USING (true);
CREATE POLICY "Admin can manage themes" ON themes FOR ALL USING (is_admin());

-- Cognitive Tags (public read)
CREATE POLICY "Anyone can view tags" ON cognitive_tags FOR SELECT USING (true);
CREATE POLICY "Admin can manage tags" ON cognitive_tags FOR ALL USING (is_admin());

-- Exercises
CREATE POLICY "Users see approved exercises" ON exercises FOR SELECT USING (status = 'approved');
CREATE POLICY "Admin manages all exercises" ON exercises FOR ALL USING (is_admin());

-- Exercise Tags (follows exercise visibility)
CREATE POLICY "Users see approved exercise tags" ON exercise_tags FOR SELECT
  USING (EXISTS (SELECT 1 FROM exercises WHERE exercises.id = exercise_id AND (exercises.status = 'approved' OR is_admin())));
CREATE POLICY "Admin manages exercise tags" ON exercise_tags FOR ALL USING (is_admin());

-- Workbooks
CREATE POLICY "Users see own workbooks" ON workbooks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own workbooks" ON workbooks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin sees all workbooks" ON workbooks FOR SELECT USING (is_admin());

-- Workbook Exercises
CREATE POLICY "Users see own workbook exercises" ON workbook_exercises FOR SELECT
  USING (EXISTS (SELECT 1 FROM workbooks WHERE workbooks.id = workbook_id AND workbooks.user_id = auth.uid()));
CREATE POLICY "Service role inserts workbook exercises" ON workbook_exercises FOR INSERT WITH CHECK (true);

-- Subscriptions
CREATE POLICY "Users see own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admin sees all subscriptions" ON subscriptions FOR SELECT USING (is_admin());

-- Generation Batches (admin only)
CREATE POLICY "Admin manages batches" ON generation_batches FOR ALL USING (is_admin());

-- Error Logs (admin only)
CREATE POLICY "Admin manages error logs" ON error_logs FOR ALL USING (is_admin());
