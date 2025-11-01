CREATE TABLE IF NOT EXISTS public.reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tool_id uuid NOT NULL,
    user_id uuid NOT NULL,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment text,
    created_at timestamptz DEFAULT now(),
    CONSTRAINT reviews_tool_id_fkey FOREIGN KEY (tool_id) REFERENCES public.ai_tools (id) ON DELETE CASCADE,
    CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
    ON public.reviews
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Authenticated users can insert reviews"
    ON public.reviews
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
    ON public.reviews
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
    ON public.reviews
    FOR DELETE
    USING (auth.uid() = user_id);
