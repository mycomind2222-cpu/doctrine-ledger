-- Rogue AI incidents table for the public dossier
CREATE TABLE public.rogue_ai_incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  model_or_agent TEXT NOT NULL,
  summary TEXT NOT NULL,
  full_writeup TEXT,
  evidence_tier SMALLINT NOT NULL CHECK (evidence_tier IN (1, 2, 3)),
  law_analog TEXT[] NOT NULL DEFAULT '{}',
  occurred_on DATE,
  source_url TEXT,
  source_type TEXT CHECK (source_type IN ('press', 'court', 'research', 'vendor', 'other')),
  related_issue_number INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.rogue_ai_incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view rogue ai incidents"
ON public.rogue_ai_incidents FOR SELECT
USING (true);

CREATE POLICY "Admins can insert rogue ai incidents"
ON public.rogue_ai_incidents FOR INSERT
TO authenticated
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update rogue ai incidents"
ON public.rogue_ai_incidents FOR UPDATE
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can delete rogue ai incidents"
ON public.rogue_ai_incidents FOR DELETE
TO authenticated
USING (is_admin(auth.uid()));

CREATE TRIGGER update_rogue_ai_incidents_updated_at
BEFORE UPDATE ON public.rogue_ai_incidents
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_rogue_ai_incidents_tier ON public.rogue_ai_incidents(evidence_tier);
CREATE INDEX idx_rogue_ai_incidents_occurred ON public.rogue_ai_incidents(occurred_on DESC NULLS LAST);
CREATE INDEX idx_rogue_ai_incidents_law_analog ON public.rogue_ai_incidents USING GIN(law_analog);