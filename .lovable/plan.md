# Add Address Autocomplete to the Estimator

Goal: When a user starts typing in the "Install Location Address" field on the estimator, show a dropdown of suggested addresses. Clicking one fills the field with the full address.

## Approach options

There are two realistic ways to do this. Both feel the same to the user — a popup of address suggestions that autofills on click.

### Option A — Google Places Autocomplete (recommended)
- Most accurate, familiar Google-style suggestions.
- Requires a Google Maps API key (Places API enabled) stored as a secret.
- Has usage costs after Google's free tier (generally inexpensive for a contact form, but not free forever).

### Option B — Mapbox / LocationIQ / Geoapify autocomplete
- Similar UX, generous free tiers.
- Still requires an API key.

### Option C — Free, no key (Photon / Nominatim by OpenStreetMap)
- No signup, no key, no cost.
- Suggestions are decent for US street addresses but not as polished as Google. Occasional gaps for very new construction or rural addresses.

I'd recommend **Option A (Google)** since you're already in Google's ecosystem (Resend emails, etc.) and address accuracy matters for estimates and site visits — but happy to use C if you want zero setup and zero cost.

## What will change (technical)

- `src/components/FenceEstimator.tsx` — replace the plain `<Input id="address">` with an autocomplete-enabled input. Suggestions appear in a popover below the field as the user types (debounced ~250ms). Clicking a suggestion sets `contactData.address` to the full formatted address.
- New small component `src/components/AddressAutocomplete.tsx` so the logic is reusable (we can drop it into the Contact page later too if you want).
- For Option A: load the Google Maps JS SDK lazily on first focus of the field (no perf hit on page load), and store the API key as a public env var (Google restricts by HTTP referrer, not by secrecy).
- For Option C: no key, just a `fetch` to `https://photon.komoot.io/api/?q=...&limit=5`.

No DB or backend changes. No impact on lead submission — the address still saves the same way.

## Question for you

Which option do you want?
1. Google Places (best UX, needs API key, small cost)
2. Free OpenStreetMap-based (good enough, zero setup, zero cost)
