I checked the code and backend state. The admin destination is `/admin`, so on the published site it should be `https://mccallfencing.com/admin` (or `https://www.mccallfencing.com/admin`, depending which domain you open). `/admin/login` is only the login page.

What I found:
- Jake has the `admin` role in the database.
- John has the `worker` role in the database.
- The app route is defined as `/admin/*`, protected by `ProtectedRoute`.
- The login code currently signs in and immediately navigates to `/admin`.
- `ProtectedRoute` then checks `hasAnyRole`; if roles are not loaded or cannot be read, it redirects back to `/admin/login`.
- A security migration revoked direct execute permissions on the backend role helper functions (`has_role`, `has_any_role`) from authenticated users. Those functions are used inside the access policies for `profiles`, `leads`, etc. This can break role/profile-dependent queries even when the user is correctly assigned a role.
- There is also still a frontend race: after sign-in, `AdminLogin` navigates to `/admin` before role loading is definitely finished.

Plan to fix:

1. Restore safe backend function execution for access policies
   - Add a migration granting authenticated users permission to execute the role-check helper functions needed by RLS policies:
     - `public.has_role(uuid, app_role)`
     - `public.has_any_role(uuid)`
   - Keep them as `SECURITY DEFINER` functions with a fixed `search_path`, so users can ask “do I have this role?” without being able to edit roles.
   - Do not expose role storage on profiles or client-side storage.

2. Make login wait for role loading before redirecting
   - Update `src/pages/AdminLogin.tsx` so successful password sign-in does not immediately navigate before `useAuth` has finished loading roles.
   - The existing effect will redirect only when `user && hasAnyRole` is true.
   - If sign-in succeeds but the user has no allowed role, show a clear “not authorized” message instead of bouncing silently.

3. Harden `useAuth` role state behavior
   - Ensure `rolesLoading` stays true while roles are being fetched after sign-in.
   - Ensure stale roles are cleared when the auth user changes, so one user’s prior role state can’t leak into another session.
   - Logically separate “signed in” from “authorized for CRM”.

4. Keep `/admin` as the canonical CRM destination
   - No separate hidden page is expected.
   - The admin CRM page is `/admin`; the login page is `/admin/login`; reset and invite routes are separate public admin utility routes.

5. Validate after implementation
   - Re-check database permissions for the role helper functions.
   - Confirm Jake and John still have their roles.
   - Verify the route logic no longer sends an authorized user back to login due to role-loading timing.