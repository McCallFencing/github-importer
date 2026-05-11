# Restrict Address Autocomplete to US Only

Customers are all US-based, so out-of-country results should never appear.

## Changes

**`supabase/functions/address-autocomplete/index.ts`**
- Census Geocoder is already US-only (no change needed there).
- Photon fallback currently has no country filter, which is why foreign addresses show up. Update the Photon request to bias and filter to the US:
  - Add `&lat=39.8283&lon=-98.5795&zoom=5` (geographic center of the US) to bias results
  - After fetching, filter `features` where `properties.countrycode === "US"` before returning
- If no US results come back from either source, return an empty list rather than foreign suggestions.

## Result
Only US addresses (street, city, place) will appear in the dropdown. No frontend changes needed.
