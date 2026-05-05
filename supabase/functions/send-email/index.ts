import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { z } from "npm:zod@3.23.8";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";
const FROM = "McCall Fencing <noreply@mccallfencing.com>";
const NOTIFY_TO = "jake@mccallfencing.com";

const BodySchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().min(1).max(50),
  address: z.string().trim().max(500).optional().nullable(),
  projectType: z.string().trim().max(200).optional().nullable(),
  message: z.string().trim().max(5000).optional().nullable(),
});

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

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

    const html = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${esc(d.name)}</p>
      <p><strong>Email:</strong> ${esc(d.email)}</p>
      <p><strong>Phone:</strong> ${esc(d.phone)}</p>
      ${d.address ? `<p><strong>Address:</strong> ${esc(d.address)}</p>` : ""}
      ${d.projectType ? `<p><strong>Project Type:</strong> ${esc(d.projectType)}</p>` : ""}
      ${d.message ? `<p><strong>Message:</strong><br>${esc(d.message).replace(/\n/g, "<br>")}</p>` : ""}
      <hr>
      <p style="color:#888;font-size:12px">Sent from mccallfencing.com contact form</p>
    `;

    const res = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: FROM,
        to: [NOTIFY_TO],
        reply_to: d.email,
        subject: `New Lead: ${d.name}${d.projectType ? ` — ${d.projectType}` : ""}`,
        html,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(`Resend [${res.status}]: ${JSON.stringify(data)}`);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-email error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
