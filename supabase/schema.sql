-- ==============================================================================
-- DINAMIS MONEY — Supabase Database Migration Schema
-- Target Database: PostgreSQL / Supabase
-- Target Hosting: Vercel + Supabase
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES / USERS
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  name TEXT NOT NULL DEFAULT 'Sales Champion',
  avatar_url TEXT,
  role TEXT DEFAULT 'owner',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BUSINESS PROFILES
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  product_or_service TEXT NOT NULL,
  avg_sale_price NUMERIC NOT NULL DEFAULT 100000,
  buyer_persona TEXT[] DEFAULT '{}',
  sales_channels TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SALES TARGETS
CREATE TABLE IF NOT EXISTS public.sales_targets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  month_name TEXT NOT NULL DEFAULT 'September',
  target_amount NUMERIC NOT NULL DEFAULT 5000000,
  achieved_amount NUMERIC NOT NULL DEFAULT 0,
  avg_commission NUMERIC NOT NULL DEFAULT 100000,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PROSPECTS
CREATE TABLE IF NOT EXISTS public.prospects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  potential NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Baru dikenal',
  priority TEXT NOT NULL DEFAULT 'WARM', -- 'HOT' | 'WARM' | 'COLD'
  last_activity TEXT DEFAULT 'Baru ditambahkan',
  days_inactive INT DEFAULT 0,
  next_recommendation TEXT DEFAULT 'Hubungi sekarang',
  phone TEXT,
  notes TEXT,
  is_money_leak BOOLEAN DEFAULT FALSE,
  leak_reason TEXT,
  resolved BOOLEAN DEFAULT FALSE,
  closed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PROSPECT ACTIVITIES / TIMELINE
CREATE TABLE IF NOT EXISTS public.prospect_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prospect_id UUID REFERENCES public.prospects ON DELETE CASCADE,
  time_ago TEXT DEFAULT 'Baru saja',
  event TEXT NOT NULL,
  type TEXT DEFAULT 'NOTE', -- 'NOTE' | 'CALL' | 'WHATSAPP' | 'PROPOSAL' | 'STATUS_CHANGE'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. DAILY ACTIONS
CREATE TABLE IF NOT EXISTS public.daily_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  label TEXT NOT NULL,
  completed_count INT DEFAULT 0,
  target_count INT NOT NULL DEFAULT 5,
  is_completed BOOLEAN DEFAULT FALSE,
  detail_title TEXT NOT NULL,
  detail_desc TEXT NOT NULL,
  suggested_template TEXT NOT NULL,
  default_customer_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CLOSINGS
CREATE TABLE IF NOT EXISTS public.closings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  sale_amount NUMERIC NOT NULL DEFAULT 0,
  profit_commission NUMERIC NOT NULL DEFAULT 0,
  source TEXT NOT NULL,
  date TEXT NOT NULL DEFAULT 'Hari ini',
  prospect_id UUID REFERENCES public.prospects ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. STRATEGIES (Reference data)
CREATE TABLE IF NOT EXISTS public.strategies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rank INT NOT NULL,
  title TEXT NOT NULL,
  label TEXT NOT NULL,
  label_color TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_key TEXT NOT NULL,
  icon_color TEXT NOT NULL
);

-- ------------------------------------------------------------------------------
-- INDEXES FOR PERFORMANCE
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_prospects_user_id ON public.prospects(user_id);
CREATE INDEX IF NOT EXISTS idx_prospects_priority ON public.prospects(priority);
CREATE INDEX IF NOT EXISTS idx_prospects_status ON public.prospects(status);
CREATE INDEX IF NOT EXISTS idx_prospect_activities_prospect_id ON public.prospect_activities(prospect_id);
CREATE INDEX IF NOT EXISTS idx_daily_actions_user_id ON public.daily_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_closings_user_id ON public.closings(user_id);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prospect_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.closings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read & update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Businesses
CREATE POLICY "Users can manage own business" ON public.businesses FOR ALL USING (auth.uid() = user_id);

-- Targets
CREATE POLICY "Users can manage own targets" ON public.sales_targets FOR ALL USING (auth.uid() = user_id);

-- Prospects
CREATE POLICY "Users can manage own prospects" ON public.prospects FOR ALL USING (auth.uid() = user_id);

-- Prospect Activities
CREATE POLICY "Users can manage activities for own prospects" ON public.prospect_activities
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.prospects WHERE id = prospect_activities.prospect_id AND user_id = auth.uid())
  );

-- Daily Actions
CREATE POLICY "Users can manage own daily actions" ON public.daily_actions FOR ALL USING (auth.uid() = user_id);

-- Closings
CREATE POLICY "Users can manage own closings" ON public.closings FOR ALL USING (auth.uid() = user_id);

-- Strategies: Public read-only
CREATE POLICY "Anyone can view strategies" ON public.strategies FOR SELECT TO authenticated, anon USING (true);
