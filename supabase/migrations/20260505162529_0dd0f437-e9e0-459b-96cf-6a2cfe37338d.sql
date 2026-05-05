-- Restrict public lead inserts: force status='new' and require non-empty contact fields
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;

CREATE POLICY "Public can submit leads"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status = 'new'
  AND source IS NOT NULL
  AND length(trim(name)) > 0 AND length(name) <= 200
  AND length(trim(email)) > 0 AND length(email) <= 320
  AND length(trim(phone)) > 0 AND length(phone) <= 50
  AND (address IS NULL OR length(address) <= 500)
  AND (message IS NULL OR length(message) <= 5000)
  AND (notes IS NULL OR length(notes) <= 5000)
);