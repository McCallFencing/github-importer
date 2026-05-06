## Goal

Add the uploaded person's face onto the hot air balloon in the hero background image (`src/assets/hero-fence.jpg`) so it's faintly visible — present but not obvious at a glance.

## Steps

1. **Convert the upload** — Copy `user-uploads://1000001872.heic` to `/tmp/`, convert HEIC → PNG using ImageMagick (via `nix run nixpkgs#imagemagick`), then crop to the face.

2. **Composite onto the balloon** — Use the Lovable AI Gateway image-edit endpoint (`google/gemini-3-pro-image-preview` for higher quality) with both images:
   - Source: current `src/assets/hero-fence.jpg`
   - Reference: cropped face PNG
   - Prompt: "Subtly blend the person's face into the striped fabric of the hot air balloon. The face should follow the curvature of the balloon, appear as a faint ghosted/printed pattern at low opacity (~20-25%), tinted to match the warm red/orange/yellow stripes. Hard to see at first glance but definitely there on close inspection. Keep all other elements of the image (fence, racetrack, sky, sunset, cars) completely unchanged."

3. **QA** — View the resulting image. Verify the face is subtly visible on the balloon and the rest of the scene is untouched. If too obvious or too invisible, re-run with adjusted opacity guidance. Iterate up to 2-3 times.

4. **Replace the asset** — Save the final result to `src/assets/hero-fence.jpg` (overwriting). The Home page already imports it, so no code changes needed.

## Notes

- Keeping the same filename + path means cache-busting happens automatically via Vite's hash on rebuild.
- If Gemini struggles to keep other parts of the image identical, fallback: do a manual PIL composite — warp the face onto the balloon's elliptical region with low alpha and a multiply/overlay blend mode tinted to balloon colors.
