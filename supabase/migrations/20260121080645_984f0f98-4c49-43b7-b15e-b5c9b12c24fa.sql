-- Add is_admin column to user_roles
ALTER TABLE public.user_roles ADD COLUMN is_admin boolean NOT NULL DEFAULT false;

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.user_roles WHERE user_id = _user_id),
    false
  )
$$;

-- Policy: Admins can view all user roles
CREATE POLICY "Admins can view all user roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Policy: Admins can update user access levels
CREATE POLICY "Admins can update user access levels"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));