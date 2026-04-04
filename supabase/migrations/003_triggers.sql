-- Trigger: Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, account_type, role, organization_name, contact_info)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'account_type')::user_account_type, 'individual'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'pecujici'),
    NEW.raw_user_meta_data->>'organization_name',
    NEW.raw_user_meta_data->>'contact_info'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Trigger: Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Trigger: Ensure only one current assessment per user
CREATE OR REPLACE FUNCTION handle_assessment_current()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_current = TRUE THEN
    UPDATE assessment_responses
    SET is_current = FALSE
    WHERE user_id = NEW.user_id AND id != NEW.id AND is_current = TRUE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_current_assessment
  AFTER INSERT OR UPDATE ON assessment_responses
  FOR EACH ROW EXECUTE FUNCTION handle_assessment_current();
