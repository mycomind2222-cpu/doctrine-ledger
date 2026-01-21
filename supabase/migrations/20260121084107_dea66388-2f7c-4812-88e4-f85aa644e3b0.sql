-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own access level" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update user access levels" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete user roles" ON public.user_roles;

-- Create new PERMISSIVE policies with explicit authentication requirements
-- Users can only view their own access level (requires authentication)
CREATE POLICY "Users can view their own access level"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins can view all user roles (requires authentication + admin status)
CREATE POLICY "Admins can view all user roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

-- Admins can update user access levels (requires authentication + admin status)
CREATE POLICY "Admins can update user access levels"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Admins can insert user roles (requires authentication + admin status)
CREATE POLICY "Admins can insert user roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (is_admin(auth.uid()));

-- Admins can delete user roles (requires authentication + admin status)
CREATE POLICY "Admins can delete user roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (is_admin(auth.uid()));