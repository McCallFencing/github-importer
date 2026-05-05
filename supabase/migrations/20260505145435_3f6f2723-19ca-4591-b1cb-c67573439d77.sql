-- Revoke EXECUTE on SECURITY DEFINER functions from public/anon/authenticated
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_any_role(uuid) FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_leads_updated_at() FROM public, anon, authenticated;

-- Tighten avatar bucket SELECT: only allow listing your own folder; public URL access still works
DROP POLICY IF EXISTS "Avatars are publicly accessible" ON storage.objects;
CREATE POLICY "Users can list their own avatar files"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Tighten the WITH CHECK (true) on user_roles updates by adding a stricter check
DROP POLICY IF EXISTS "Only admins can update user_roles" ON public.user_roles;
CREATE POLICY "Only admins can update user_roles"
  ON public.user_roles FOR UPDATE
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));