## Set up email notifications via Resend

Resend is now connected to the project (key stored securely — not in code). Now I'll build the two backend functions your frontend already calls.

### What gets built

**1. `send-email` edge function** (called by the Contact page)
- Sends a notification to **info@mccallfencing.com** with: name, email, phone, address, project type, message
- `Reply-To` set to the customer's email so you can reply directly from your inbox
- Validates input with Zod (rejects spam/malformed submissions)

**2. `send-estimate-email` edge function** (called by the Fence Estimator)
- Sends **two** emails:
  - **To you (info@mccallfencing.com)**: full lead + project details + estimate breakdown (material/gate costs)
  - **To the customer**: a clean copy of their estimate with your contact info
- `Reply-To` on the customer copy points back to info@mccallfencing.com

### From address
Both will send as `McCall Fencing <info@mccallfencing.com>` — make sure `mccallfencing.com` is the verified domain in your Resend account (you mentioned it is).

### Security
- Resend key lives in Lovable's secret store, accessed only server-side via the connector gateway
- Inputs validated server-side with Zod
- CORS headers handled correctly so the browser can call them

### What I won't change
- No frontend changes — your Contact form and Estimator already invoke these two functions; they just need to exist.
- No database changes — leads are still saved as today.

Approve and I'll create both functions and deploy them.