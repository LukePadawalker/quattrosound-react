-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'operator' CHECK (role IN ('admin', 'operator', 'viewer')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create company_settings table
CREATE TABLE IF NOT EXISTS public.company_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT DEFAULT 'QuattroSound',
  company_logo TEXT,
  address TEXT,
  vat_number TEXT,
  phone TEXT,
  email TEXT,
  working_hours JSONB DEFAULT '{"mon": "09:00-18:00", "tue": "09:00-18:00", "wed": "09:00-18:00", "thu": "09:00-18:00", "fri": "09:00-18:00", "sat": "Chiuso", "sun": "Chiuso"}'::jsonb,
  billing_preferences TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create system_settings table
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notifications_email BOOLEAN DEFAULT true,
  notifications_push BOOLEAN DEFAULT false,
  backup_frequency TEXT DEFAULT 'daily',
  gdpr_compliance BOOLEAN DEFAULT true,
  integrations JSONB DEFAULT '{"stripe": false, "whatsapp": false, "google": false}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view all profiles, but only update their own
-- Note: In a real app, you might restrict who can view all profiles
CREATE POLICY "Profiles are viewable by authenticated users." ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile." ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Company Settings: Authenticated users can read, only admins can update
CREATE POLICY "Company settings are viewable by authenticated users." ON public.company_settings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only admins can update company settings." ON public.company_settings
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- System Settings: Authenticated users can read, only admins can update
CREATE POLICY "System settings are viewable by authenticated users." ON public.system_settings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only admins can update system settings." ON public.system_settings
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Seed initial company settings if none exist
INSERT INTO public.company_settings (company_name)
SELECT 'QuattroSound'
WHERE NOT EXISTS (SELECT 1 FROM public.company_settings);

-- Seed initial system settings if none exist
INSERT INTO public.system_settings (notifications_email)
SELECT true
WHERE NOT EXISTS (SELECT 1 FROM public.system_settings);
