-- Roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'worker', 'user');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Role check functions
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE OR REPLACE FUNCTION public.has_any_role(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin', 'worker')) $$;

-- Leads
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('contact_form', 'estimate_calculator')),
  address TEXT,
  project_type TEXT,
  message TEXT,
  calculator_mode TEXT CHECK (calculator_mode IN ('install', 'diy')),
  fence_type TEXT,
  fence_name TEXT,
  fence_height INTEGER,
  linear_feet INTEGER,
  single_gates INTEGER DEFAULT 0,
  double_gates INTEGER DEFAULT 0,
  estimate_low INTEGER,
  estimate_high INTEGER,
  estimate_total INTEGER,
  material_cost INTEGER,
  gate_costs INTEGER,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', '1st_attempt', '2nd_attempt', '3rd_attempt', 'emailed', 'scheduled_estimate', 'unresponsive', 'quoted', 'won', 'lost')),
  notes TEXT
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX idx_leads_source ON public.leads(source);
CREATE INDEX idx_leads_status ON public.leads(status);

CREATE OR REPLACE FUNCTION public.update_leads_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trigger_leads_updated_at BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_leads_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$ BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Lead assignments
CREATE TABLE public.lead_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  assigned_to UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.lead_assignments ENABLE ROW LEVEL SECURITY;

-- Lead notes
CREATE TABLE public.lead_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;

-- Lead activity log
CREATE TABLE public.lead_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.lead_activity_log ENABLE ROW LEVEL SECURITY;

-- Follow-up reminders
CREATE TABLE public.follow_up_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  assigned_to UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reminder_date TIMESTAMPTZ NOT NULL,
  message TEXT,
  sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.follow_up_reminders ENABLE ROW LEVEL SECURITY;

-- Invitations
CREATE TABLE public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days'),
  accepted BOOLEAN NOT NULL DEFAULT false,
  accepted_at TIMESTAMPTZ,
  used_at TIMESTAMPTZ,
  role TEXT NOT NULL DEFAULT 'worker',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_invitations_token ON public.invitations(token);

-- ========= RLS POLICIES =========

-- Profiles
CREATE POLICY "Team can read all profiles" ON public.profiles FOR SELECT USING (has_any_role(auth.uid()));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (has_role(auth.uid(), 'admin'));

-- User roles
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Workers can read user_roles" ON public.user_roles FOR SELECT USING (has_role(auth.uid(), 'worker'));
CREATE POLICY "Admins can read user_roles" ON public.user_roles FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert user_roles" ON public.user_roles FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can update user_roles" ON public.user_roles FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can delete user_roles" ON public.user_roles FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Leads
CREATE POLICY "Anyone can insert leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Team can read leads" ON public.leads FOR SELECT USING (has_any_role(auth.uid()));
CREATE POLICY "Team can update leads" ON public.leads FOR UPDATE USING (has_any_role(auth.uid()));
CREATE POLICY "Only admins can delete leads" ON public.leads FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Lead assignments
CREATE POLICY "Team can manage lead_assignments" ON public.lead_assignments FOR ALL USING (has_any_role(auth.uid())) WITH CHECK (has_any_role(auth.uid()));

-- Lead notes
CREATE POLICY "Admins can manage lead_notes" ON public.lead_notes FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Workers can read lead_notes" ON public.lead_notes FOR SELECT USING (has_role(auth.uid(), 'worker'));
CREATE POLICY "Workers can insert lead_notes" ON public.lead_notes FOR INSERT WITH CHECK (has_role(auth.uid(), 'worker'));
CREATE POLICY "Team can delete lead_notes" ON public.lead_notes FOR DELETE USING (has_any_role(auth.uid()));

-- Lead activity log
CREATE POLICY "Team can read lead_activity_log" ON public.lead_activity_log FOR SELECT USING (has_any_role(auth.uid()));
CREATE POLICY "Team can insert lead_activity_log" ON public.lead_activity_log FOR INSERT WITH CHECK (has_any_role(auth.uid()));
CREATE POLICY "Only admins can delete lead_activity_log" ON public.lead_activity_log FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Follow-up reminders
CREATE POLICY "Team can manage follow_up_reminders" ON public.follow_up_reminders FOR ALL USING (has_any_role(auth.uid())) WITH CHECK (has_any_role(auth.uid()));

-- Invitations
CREATE POLICY "Admins can manage invitations" ON public.invitations FOR ALL USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Workers can view invitations" ON public.invitations FOR SELECT USING (has_role(auth.uid(), 'worker'));

-- Storage: avatars bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Avatars are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own avatar" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own avatar" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);