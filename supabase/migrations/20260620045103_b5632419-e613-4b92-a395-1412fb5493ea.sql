
-- Fix storage policies: restrict write to admins, drop broad SELECT to prevent listing
DROP POLICY IF EXISTS "Service role can upload issue covers" ON storage.objects;
DROP POLICY IF EXISTS "Service role can update issue covers" ON storage.objects;
DROP POLICY IF EXISTS "Service role can delete issue covers" ON storage.objects;
DROP POLICY IF EXISTS "Issue covers are publicly accessible" ON storage.objects;

CREATE POLICY "Admins can upload issue covers"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'issue-covers' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update issue covers"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'issue-covers' AND public.is_admin(auth.uid()))
WITH CHECK (bucket_id = 'issue-covers' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete issue covers"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'issue-covers' AND public.is_admin(auth.uid()));

-- Note: bucket is public, so direct object URLs still work without a SELECT policy.

-- Tighten founding_members insert: require valid email format and reasonable length
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.founding_members;
CREATE POLICY "Anyone can subscribe"
ON public.founding_members FOR INSERT TO anon, authenticated
WITH CHECK (
  email IS NOT NULL
  AND length(email) BETWEEN 5 AND 254
  AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);

-- Revoke EXECUTE on SECURITY DEFINER functions not intended for direct client calls
REVOKE EXECUTE ON FUNCTION public.get_user_access_level(uuid) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_access_level(uuid, public.access_level) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, PUBLIC;
-- get_user_vote is intentionally callable by signed-in users; keep authenticated execute
REVOKE EXECUTE ON FUNCTION public.get_user_vote(integer) FROM anon, PUBLIC;
