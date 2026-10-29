# Portrait opening animation

Generated with the built-in imagegen tool on October 22, 2026. The real photograph supplied by the owner is the identity and pose reference; the supplied yellow poster is a color-treatment reference only. Generative likeness is approximate and was visually checked against the original photograph.

Master: `output/imagegen/tanzamul-intro-portrait-v1.png`. Production: responsive, alpha-preserving WebP files under `public/images/intro/`. Background, typography and motion are rendered separately in the component. No runtime image-generation service or video service is used.

Production variants are 480px (28,174 bytes), 800px (59,104 bytes), and 1200px (124,786 bytes), encoded with Sharp at WebP quality 86 / alpha quality 95 / effort 6. Their versioned URLs receive the existing one-year immutable image cache policy. The browser chooses one variant; image loading never extends the fixed intro duration. Existing typography uses the site's heading font rather than generating text inside the bitmap.

The intro preserves the black TANZAMUL board, counter and skip behavior, adding a yellow panel, subtle upward portrait reveal, name wipe and curtain exit. Approximate duration is 2.6 seconds, once per tab session. Reduced motion, Save Data, 2G and background tabs skip it. Full page content remains in server HTML, with a no-JavaScript overlay fallback. Browser proof: `output/preloader/portrait-intro-preview.png`.

## Final prompt

Use case: identity-preserve / background-extraction.
Asset type: transparent portrait layer for Tanzamul's black-and-yellow portfolio opening animation.
Input image 1 (real photograph) is the edit target and SOLE identity, facial anatomy, hair, clothing and pose reference. Input image 2 (yellow poster) is ONLY a reference for the navy monochrome editorial color treatment, NOT the face or head angle.
Primary request: extract and carefully finish the real person from image 1 as an elegant photographic portrait cutout. Preserve his actual face exactly as closely as possible: original head angle looking slightly left, sunglasses shape and position, nose, lips, jawline, beard density, hair silhouette and real proportions. Do not use the exaggerated upward-facing head or different face from the poster.
Composition: isolated upper-body portrait from the original photo, head through waist, original arm pose. Keep entire hair and both shoulders within canvas with a little margin. Remove railing, plants, all architecture and background completely. Natural finished clothing edges at lower frame.
Style: high-resolution photographic texture with restrained midnight navy / neutral monochrome duotone, soft silver skin highlights, deep charcoal suit; retain realistic detail, no painted skin or sharpening halos. This goes over a near-black website with a separately coded yellow rectangle and live typography.
Background: genuinely transparent alpha, no white, no black rectangle, no checkerboard baked in.
Text: none. No lettering, logos, watermark, yellow block or border.
Constraints: change only background removal and color treatment. Faithful real photograph likeness and anatomy are the highest priority; do not invent a different expression, head tilt, hairstyle or facial features.
