
CREATE OR REPLACE FUNCTION public.auto_grant_admin_najmadaib79()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'najmadaib79@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER grant_admin_najmadaib79
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.auto_grant_admin_najmadaib79();
