
-- Tighten lead_activity_log INSERT to enforce user_id attribution
DROP POLICY IF EXISTS "Team can insert lead_activity_log" ON public.lead_activity_log;
CREATE POLICY "Team can insert lead_activity_log"
  ON public.lead_activity_log FOR INSERT
  WITH CHECK (has_any_role(auth.uid()) AND user_id = auth.uid());

-- Constrain financial fields on public lead inserts
DROP POLICY IF EXISTS "Public can submit leads" ON public.leads;
CREATE POLICY "Public can submit leads"
  ON public.leads FOR INSERT
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
    AND (estimate_low IS NULL OR estimate_low BETWEEN 0 AND 9999999)
    AND (estimate_high IS NULL OR estimate_high BETWEEN 0 AND 9999999)
    AND (estimate_total IS NULL OR estimate_total BETWEEN 0 AND 9999999)
    AND (material_cost IS NULL OR material_cost BETWEEN 0 AND 9999999)
    AND (gate_costs IS NULL OR gate_costs BETWEEN 0 AND 9999999)
    AND (linear_feet IS NULL OR linear_feet BETWEEN 0 AND 100000)
    AND (fence_height IS NULL OR fence_height BETWEEN 0 AND 100)
    AND (single_gates IS NULL OR single_gates BETWEEN 0 AND 100)
    AND (double_gates IS NULL OR double_gates BETWEEN 0 AND 100)
  );
