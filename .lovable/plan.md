## Root cause

The fence estimator submits leads with `source: 'calculator'`, but the `leads` table has a CHECK constraint that only allows `'contact_form'` or `'estimate_calculator'`. Every estimator submission is rejected by the database, but the error is only `console.error`'d — the email still goes out, so it looks like everything worked.

That's why Resend shows the emails but `/admin` is empty for any estimator-sourced lead (the 11 existing leads are all `contact_form`, none from the past 6 days).

## Fix

1. In `src/components/FenceEstimator.tsx` (line 305), change `source: 'calculator'` to `source: 'estimate_calculator'` so the insert satisfies the check constraint.

2. Improve error surfacing so this can't happen silently again: if `leadError` is set in either `FenceEstimator.tsx` or `Contact.tsx`, show a toast (or at least include the error in the existing failure path) instead of only `console.error`.

That's the entire change — no schema migration, no RLS changes needed. Existing leads stay as-is, and new estimator submissions will start showing up on `/admin` immediately.