
CREATE TABLE public.issue_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  issue_number integer NOT NULL,
  vote_type text NOT NULL DEFAULT 'upvote' CHECK (vote_type IN ('upvote', 'downvote')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, issue_number)
);

ALTER TABLE public.issue_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view vote counts" ON public.issue_votes
  FOR SELECT TO public USING (true);

CREATE POLICY "Authenticated users can vote" ON public.issue_votes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own votes" ON public.issue_votes
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes" ON public.issue_votes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
