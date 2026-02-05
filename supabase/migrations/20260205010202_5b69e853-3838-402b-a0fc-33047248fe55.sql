-- Create issues table for dynamic issue storage
CREATE TABLE public.issues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  number INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL,
  theme TEXT NOT NULL,
  cover_image TEXT,
  publication_status TEXT NOT NULL DEFAULT 'draft' CHECK (publication_status IN ('published', 'draft')),
  publish_date DATE NOT NULL DEFAULT CURRENT_DATE,
  tags TEXT[] NOT NULL DEFAULT '{}',
  sections JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  generated_by TEXT DEFAULT 'ai' CHECK (generated_by IN ('ai', 'manual'))
);

-- Enable RLS
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

-- Public can view published issues
CREATE POLICY "Anyone can view published issues"
ON public.issues
FOR SELECT
USING (publication_status = 'published');

-- Admins can manage all issues
CREATE POLICY "Admins can manage issues"
ON public.issues
FOR ALL
USING (is_admin(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_issues_updated_at
BEFORE UPDATE ON public.issues
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for efficient queries
CREATE INDEX idx_issues_number ON public.issues(number);
CREATE INDEX idx_issues_publish_date ON public.issues(publish_date);
CREATE INDEX idx_issues_status ON public.issues(publication_status);