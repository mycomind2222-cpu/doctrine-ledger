
ALTER TABLE public.issues
ADD COLUMN quality_score integer DEFAULT NULL,
ADD COLUMN quality_notes text DEFAULT NULL;
