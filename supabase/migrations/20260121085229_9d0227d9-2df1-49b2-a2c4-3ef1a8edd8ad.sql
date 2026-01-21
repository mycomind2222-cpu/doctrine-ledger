-- Add explicit admin-only UPDATE policy for founding_members
-- This ensures no one can modify email records except admins
CREATE POLICY "Admins can update subscribers"
ON public.founding_members
FOR UPDATE
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Add comment documenting security requirement
COMMENT ON TABLE public.founding_members IS 'Email collection for founding member campaign. SECURITY: SELECT/UPDATE/DELETE restricted to admins only. Never add public SELECT policy.';