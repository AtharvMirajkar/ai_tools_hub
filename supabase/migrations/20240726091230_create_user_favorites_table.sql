CREATE TABLE IF NOT EXISTS public.user_favorites (
    user_id uuid NOT NULL,
    tool_id uuid NOT NULL,
    created_at timestamptz DEFAULT now(),
    CONSTRAINT user_favorites_pkey PRIMARY KEY (user_id, tool_id),
    CONSTRAINT user_favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
    CONSTRAINT user_favorites_tool_id_fkey FOREIGN KEY (tool_id) REFERENCES public.ai_tools (id) ON DELETE CASCADE
);

ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites" 
ON public.user_favorites
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" 
ON public.user_favorites
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" 
ON public.user_favorites
FOR DELETE
USING (auth.uid() = user_id);
