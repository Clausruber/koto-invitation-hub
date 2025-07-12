
-- Remove formatted_date column from invitations table
ALTER TABLE public.invitations DROP COLUMN formatted_date;

-- Create news table
CREATE TABLE public.news (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  noticia TEXT NOT NULL,
  fecha TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  image_url TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- RLS policies for news - users can view all news but only manage their own
CREATE POLICY "Users can view all news" 
  ON public.news 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own news" 
  ON public.news 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own news" 
  ON public.news 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own news" 
  ON public.news 
  FOR DELETE 
  USING (auth.uid() = user_id);
