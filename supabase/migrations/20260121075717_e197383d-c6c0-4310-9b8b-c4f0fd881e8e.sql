-- Create enum for access levels
CREATE TYPE public.access_level AS ENUM ('public', 'professional', 'restricted');

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  access_level access_level NOT NULL DEFAULT 'public',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check access level (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.get_user_access_level(_user_id UUID)
RETURNS access_level
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT access_level FROM public.user_roles WHERE user_id = _user_id),
    'public'::access_level
  )
$$;

-- Function to check if user has at least a certain access level
CREATE OR REPLACE FUNCTION public.has_access_level(_user_id UUID, _required_level access_level)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE 
    WHEN _required_level = 'public' THEN true
    WHEN _required_level = 'professional' THEN 
      public.get_user_access_level(_user_id) IN ('professional', 'restricted')
    WHEN _required_level = 'restricted' THEN 
      public.get_user_access_level(_user_id) = 'restricted'
    ELSE false
  END
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own access level"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Only admins can modify access levels (we'll handle this via edge function)
-- For now, users cannot modify their own access level

-- Trigger to auto-create user_roles on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, access_level)
  VALUES (NEW.id, 'public');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();