
-- Create RPC to get aggregated vote counts without exposing user_id
CREATE OR REPLACE FUNCTION public.get_issue_vote_counts()
RETURNS TABLE(issue_number integer, upvotes bigint, downvotes bigint)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = 'public'
AS $$
  SELECT 
    iv.issue_number,
    COUNT(*) FILTER (WHERE iv.vote_type = 'upvote') as upvotes,
    COUNT(*) FILTER (WHERE iv.vote_type = 'downvote') as downvotes
  FROM public.issue_votes iv
  GROUP BY iv.issue_number
$$;

-- Create RPC to get a user's own vote on an issue
CREATE OR REPLACE FUNCTION public.get_user_vote(p_issue_number integer)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT vote_type 
  FROM public.issue_votes 
  WHERE user_id = auth.uid() 
    AND issue_number = p_issue_number
  LIMIT 1
$$;

-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Anyone can view vote counts" ON public.issue_votes;

-- Add a policy that only lets authenticated users see their own votes
CREATE POLICY "Users can view own votes"
ON public.issue_votes
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
