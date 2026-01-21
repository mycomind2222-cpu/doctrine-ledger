-- Create table for founding member email subscribers
CREATE TABLE public.founding_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  source TEXT DEFAULT 'founding_member_campaign'
);

-- Enable RLS
ALTER TABLE public.founding_members ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for email collection)
CREATE POLICY "Anyone can subscribe"
ON public.founding_members
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can view subscribers
CREATE POLICY "Admins can view subscribers"
ON public.founding_members
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

-- Only admins can delete subscribers
CREATE POLICY "Admins can delete subscribers"
ON public.founding_members
FOR DELETE
TO authenticated
USING (is_admin(auth.uid()));