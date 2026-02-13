
-- Create storage bucket for AI-generated issue cover images
INSERT INTO storage.buckets (id, name, public) VALUES ('issue-covers', 'issue-covers', true);

-- Allow public read access
CREATE POLICY "Issue covers are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'issue-covers');

-- Allow service role to upload (edge functions use service role)
CREATE POLICY "Service role can upload issue covers"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'issue-covers');

CREATE POLICY "Service role can update issue covers"
ON storage.objects FOR UPDATE
USING (bucket_id = 'issue-covers');

CREATE POLICY "Service role can delete issue covers"
ON storage.objects FOR DELETE
USING (bucket_id = 'issue-covers');
