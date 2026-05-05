import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { z } from "npm:zod@3.23.8";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const FROM = "McCall Fencing <jake@mccallfencing.com>";
const NOTIFY_TO = "millfrommccall@gmail.com";

const BodySchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().min(1).max(50),
  address: z.string().trim().max(500).optional().nullable(),
  calculatorMode: z.string().max(50).optional().nullable(),
  fenceType: z.string().max(100).optional().nullable(),
  fenceName: z.string().max(200).optional().nullable(),
  height: z.union([z.number(), z.string()]).optional().nullable(),
  linearFeet: z.union([z.number(), z.string()]).optional().nullable(),
  singleGates: z.union([z.number(), z.string()]).optional().nullable(),
  doubleGates: z.union([z.number(), z.string()]).optional().nullable(),
  estimateLow: z.number().optional().nullable(),
  estimateHigh: z.number().optional().nullable(),
  totalDiy: z.number().optional().nullable(),
  materialCost: z.number().optional().nullable(),
  gateCosts: z.number().optional().nullable(),
});

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const money = (n: number | null | undefined) =>
  n == null ? "—" : `$${Math.round(n).toLocaleString()}`;

function buildHtml(d: z.infer<typeof BodySchema>, forCustomer: boolean) {
  const isInstall = d.calculatorMode === "install";
  const estimateBlock = isInstall
    ? `<p><strong>Installed Estimate:</strong> ${money(d.estimateLow)} – ${money(d.estimateHigh)}</p>`
    : `<p><strong>DIY Materials Total:</strong> ${money(d.totalDiy)}</p>`;

  const intro = forCustomer
    ? `<p>Hi ${esc(d.name)},</p><p>Thanks for using our fence estimator! Here's a copy of your estimate. A McCall Fencing team member will reach out shortly.</p>`
    : `<h2>New Estimate Request</h2>`;

  return `
    ${intro}
    <h3>Customer</h3>
    <p><strong>Name:</strong> ${esc(d.name)}<br>
    <strong>Email:</strong> ${esc(d.email)}<br>
    <strong>Phone:</strong> ${esc(d.phone)}
    ${d.address ? `<br><strong>Address:</strong> ${esc(d.address)}` : ""}</p>
    <h3>Project Details</h3>
    <p><strong>Mode:</strong> ${esc(d.calculatorMode || "—")}<br>
    <strong>Fence:</strong> ${esc(d.fenceName || d.fenceType || "—")}<br>
    <strong>Height:</strong> ${esc(d.height ?? "—")} ft<br>
    <strong>Linear Feet:</strong> ${esc(d.linearFeet ?? "—")}<br>
    <strong>Single Gates:</strong> ${esc(d.singleGates ?? 0)}<br>
    <strong>Double Gates:</strong> ${esc(d.doubleGates ?? 0)}</p>
    <h3>Estimate</h3>
    ${estimateBlock}
    ${!forCustomer && d.materialCost != null ? `<p><strong>Material Cost:</strong> ${money(d.materialCost)}</p>` : ""}
    ${!forCustomer && d.gateCosts != null ? `<p><strong>Gate Costs:</strong> ${money(d.gateCosts)}</p>` : ""}
    <hr>
    <p style="color:#888;font-size:12px">McCall Commercial Fencing · (423) 477-4882 · mccallfencing.com</p>
  `;
}

async function send(payload: Record<string, unknown>, lovable: string, resend: string) {
  const res = await fetch(`${GATEWAY_URL}/emails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${lovable}`,
      "X-Connection-Api-Key": resend,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Resend [${res.status}]: ${JSON.stringify(data)}`);
  return data;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const d = parsed.data;

    await send(
      {
        from: FROM,
        to: [NOTIFY_TO],
        reply_to: d.email,
        subject: `New Estimate: ${d.name}${d.fenceName ? ` — ${d.fenceName}` : ""}`,
        html: buildHtml(d, false),
      },
      LOVABLE_API_KEY,
      RESEND_API_KEY,
    );

    await send(
      {
        from: FROM,
        to: [d.email],
        reply_to: NOTIFY_TO,
        subject: `Your McCall Fencing Estimate`,
        html: buildHtml(d, true),
      },
      LOVABLE_API_KEY,
      RESEND_API_KEY,
    );

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-estimate-email error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
