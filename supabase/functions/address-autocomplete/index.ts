import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

type Suggestion = { label: string };

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

function photonLabel(feature: any) {
  const p = feature?.properties || {};
  const parts = [
    [p.housenumber, p.street].filter(Boolean).join(" ") || p.name,
    p.city || p.town || p.village,
    p.state,
    p.postcode,
  ].filter(Boolean);
  return parts.join(", ");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { query } = await req.json();
    const address = String(query || "").trim();

    if (address.length < 4) return json({ suggestions: [] });

    const suggestions: Suggestion[] = [];
    const censusUrl =
      `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress` +
      `?address=${encodeURIComponent(address)}` +
      `&benchmark=Public_AR_Current&format=json`;

    const censusRes = await fetch(censusUrl);
    if (censusRes.ok) {
      const data = await censusRes.json();
      const matches: any[] = data?.result?.addressMatches || [];
      matches.slice(0, 5).forEach((m) => {
        if (m?.matchedAddress) suggestions.push({ label: m.matchedAddress });
      });
    }

    if (suggestions.length === 0) {
      const photonUrl =
        `https://photon.komoot.io/api/?q=${encodeURIComponent(address)}` +
        `&limit=10&lang=en&lat=39.8283&lon=-98.5795&zoom=5`;
      const photonRes = await fetch(photonUrl);
      if (photonRes.ok) {
        const data = await photonRes.json();
        (data?.features || [])
          .filter((f: any) => f?.properties?.countrycode === "US")
          .forEach((feature: any) => {
            const label = photonLabel(feature);
            if (label) suggestions.push({ label });
          });
      }
    }

    return json({ suggestions: suggestions.slice(0, 5) });
  } catch (err) {
    console.error("address-autocomplete error:", err);
    return json({ suggestions: [] });
  }
});