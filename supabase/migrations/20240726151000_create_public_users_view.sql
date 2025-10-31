CREATE VIEW public.users_public_data AS
SELECT
  id,
  raw_user_meta_data ->> 'full_name' as full_name
FROM
  auth.users;

GRANT SELECT ON public.users_public_data TO public;
