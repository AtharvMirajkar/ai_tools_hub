ALTER TABLE public.reviews
ADD CONSTRAINT reviews_tool_id_user_id_key UNIQUE (tool_id, user_id);
