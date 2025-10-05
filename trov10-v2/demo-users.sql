-- Insert demo users for testing
-- Note: These should be inserted into auth.users table first, then the trigger will create the corresponding records in users table

-- Demo Tour Operator
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'operator@travelpro.com',
  crypt('demo123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"name": "John Smith", "phone": "+1234567890", "role": "TOUR_OPERATOR", "profile": {"company": "TravelPro Tours", "experience": "5 years"}}'::jsonb
) ON CONFLICT (email) DO NOTHING;

-- Demo Travel Agent
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'agent@travelpro.com',
  crypt('demo123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"name": "Sarah Johnson", "phone": "+1234567891", "role": "TRAVEL_AGENT", "profile": {"agency": "Global Travel Co", "specialization": "Luxury Travel"}}'::jsonb
) ON CONFLICT (email) DO NOTHING;

-- Demo Admin
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'admin@travelpro.com',
  crypt('demo123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"name": "Admin User", "phone": "+1234567892", "role": "ADMIN", "profile": {"department": "Operations", "level": "Senior"}}'::jsonb
) ON CONFLICT (email) DO NOTHING;

-- Demo Super Admin
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'superadmin@travelpro.com',
  crypt('demo123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"name": "Super Admin", "phone": "+1234567893", "role": "SUPER_ADMIN", "profile": {"access_level": "Full", "permissions": "All"}}'::jsonb
) ON CONFLICT (email) DO NOTHING;
