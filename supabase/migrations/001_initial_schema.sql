-- Create custom types/enums
CREATE TYPE registration_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'WAITLISTED');
CREATE TYPE payment_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED');
CREATE TYPE contact_status AS ENUM ('PENDING', 'RESPONDED', 'ARCHIVED');
CREATE TYPE admin_role AS ENUM ('SUPER_ADMIN', 'ADMIN', 'MODERATOR');

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (managed by Supabase Auth)
-- Note: auth.users is managed by Supabase, we'll create a profiles table to extend it
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Teams table
CREATE TABLE public.teams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  team_name TEXT UNIQUE NOT NULL,
  institution TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  
  -- Team Leader
  leader_name TEXT NOT NULL,
  leader_email TEXT NOT NULL,
  leader_phone TEXT NOT NULL,
  
  -- Robot Details
  robot_name TEXT NOT NULL,
  robot_weight DECIMAL NOT NULL,
  robot_dimensions TEXT NOT NULL,
  weapon_type TEXT NOT NULL,
  
  -- Status
  status registration_status DEFAULT 'PENDING',
  payment_id TEXT UNIQUE,
  payment_status payment_status DEFAULT 'PENDING',
  payment_date TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_user_email UNIQUE (user_email)
);

-- Create indexes for teams
CREATE INDEX idx_teams_status ON public.teams(status);
CREATE INDEX idx_teams_payment_status ON public.teams(payment_status);
CREATE INDEX idx_teams_user_email ON public.teams(user_email);

-- Enable RLS for teams
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Teams policies
CREATE POLICY "Users can view their own team" ON public.teams
  FOR SELECT USING (user_email = (SELECT email FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert their own team" ON public.teams
  FOR INSERT WITH CHECK (user_email = (SELECT email FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update their own team" ON public.teams
  FOR UPDATE USING (user_email = (SELECT email FROM public.profiles WHERE id = auth.uid()));

-- Admin can view all teams (we'll handle this in the application layer with service role key)

-- Team Members table
CREATE TABLE public.team_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for team members
CREATE INDEX idx_team_members_team_id ON public.team_members(team_id);

-- Enable RLS for team_members
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Team members policies
CREATE POLICY "Users can view their team members" ON public.team_members
  FOR SELECT USING (
    team_id IN (
      SELECT id FROM public.teams WHERE user_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    )
  );

CREATE POLICY "Users can insert their team members" ON public.team_members
  FOR INSERT WITH CHECK (
    team_id IN (
      SELECT id FROM public.teams WHERE user_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    )
  );

CREATE POLICY "Users can update their team members" ON public.team_members
  FOR UPDATE USING (
    team_id IN (
      SELECT id FROM public.teams WHERE user_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    )
  );

-- Contacts table
CREATE TABLE public.contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status contact_status DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for contacts
CREATE INDEX idx_contacts_status ON public.contacts(status);

-- Enable RLS for contacts (public can insert, admin can read)
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact" ON public.contacts
  FOR INSERT WITH CHECK (true);

-- Newsletter table
CREATE TABLE public.newsletter (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for newsletter
ALTER TABLE public.newsletter ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter
  FOR INSERT WITH CHECK (true);

-- Admins table (for separate admin authentication)
CREATE TABLE public.admins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role admin_role DEFAULT 'ADMIN',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for admins
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create a function to handle new user creation in profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, image)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
