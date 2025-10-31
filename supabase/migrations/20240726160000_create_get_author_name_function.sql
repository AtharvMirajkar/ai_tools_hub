CREATE OR REPLACE FUNCTION get_author_name(posts posts) RETURNS jsonb AS $$
BEGIN
  RETURN (
    SELECT jsonb_build_object('full_name', raw_user_meta_data->>'full_name')
    FROM auth.users
    WHERE id = posts.user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
