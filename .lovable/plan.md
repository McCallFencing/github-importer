## Fix: Restrict invitations to admins only

**Migration:**
```sql
DROP POLICY IF EXISTS "Workers can view invitations" ON public.invitations;
```

That removes worker SELECT access. The existing "Admins can manage invitations" policy keeps full admin access intact. Workers' lead-management abilities are untouched.

**No code changes needed** — the Team Management UI already only shows pending invitations inside an `isAdmin` check.

After running, the security finding will clear on the next scan.
