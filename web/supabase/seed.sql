-- Enable pgcrypto if not already
create extension if not exists "pgcrypto";

-- Create a test user: demo@flamefit.app / password123
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'authenticated',
  'authenticated',
  'demo@flamefit.app',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name": "Demo User"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Identity mapping
INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'demo@flamefit.app',
  '{"sub": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", "email": "demo@flamefit.app"}',
  'email',
  now(),
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;
