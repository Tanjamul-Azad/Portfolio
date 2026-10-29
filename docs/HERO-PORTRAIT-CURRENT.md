# Current-face hero portrait

Owner approved `output/imagegen/hero-current-face-preview-v3.png` on October 22, 2026. The exact approved pixels are copied losslessly to `public/images/hero-portrait-current-v2.png`; no additional face edits, sharpening, or artificial upscaling are applied after approval. Native size is 1031 x 1525. The prior original `public/images/hero-portrait.jpg` is retained.

The existing build pipeline creates responsive WebP variants at quality 90, without enlargement, plus a tiny placeholder. Hero uses its existing priority loading, dimensions, positioning, alt text and edge blending. Content-hashed variant URLs use the existing one-year immutable caching policy. No runtime image generation or new service is added.

Built-in imagegen generated the approved preview using the original hero as the edit target and the owner's most recent real outdoor photograph as the face/beard reference. Earlier generated previews were excluded from identity input. Generated likeness is approximate and was approved by the owner. Full generation prompt: `output/imagegen/hero-current-face-preview-v3-prompt.md`.

## Original generation prompt

Use case: identity-preserve / precise-object-edit.
IMAGE 1 = original existing HERO PORTRAIT, the edit target. IMAGE 2 = owner's new REAL CURRENT FACE reference, authoritative for identity and current facial-hair pattern. They show the same person. Do not use any previous generated previews as identity references.
Update the facial hair of the ORIGINAL HERO to match the REAL CURRENT FACE in image 2 closely. Carefully retain the same real person's facial structure: the natural rounded/compact chin, cheek fullness, eye shape and spacing, eyebrow shape, nose width and lip shape visible in the real reference. Do NOT make a new generic/handsome/model face, slim cheeks, sharpen jaw, enlarge eyes, smooth skin or alter age. Keep the hero's original forward-facing pose, gaze and slight smile; adapt the reference to that pose rather than copying its tilted head.
BEARD: match the actual distribution in image 2: modest natural moustache, short sideburn/lower-cheek stubble, denser but short natural beard along the jaw and under the chin, softer sparse coverage on the chin's front. Natural skin remains visible between the lower lip and beard. NO French cut, no vertical dark connectors descending from the two moustache/mouth corners toward chin, no circular outline around mouth, no thick isolated goatee. Do not overemphasize moustache or turn chin beard into a pointed block. The real reference provides the density and contours; inspect it closely.
MINIMAL EDIT: keep original hero eyes, brows, nose, mouth and face anatomy as close as possible, applying only the subtle present-day facial-hair difference. Preserve real skin texture and tone without engraved patterns or plastic retouching.
ALL NON-FACE ELEMENTS EXACTLY UNCHANGED FROM IMAGE 1: same front-facing body position, same swept hairstyle and silhouette, black denim jacket, black turtleneck, lighting, plain pure-black background, original portrait crop/aspect ratio 2276:3360, and original gold handwritten "Tanzamul" across lower torso with the same spelling, stroke, size and position.
Do NOT import the light polo, brick wall, railing, watch, outdoor light, body pose or tilted-head composition from reference 2. No added accessories, glasses, text or watermark.
This is an identity-sensitive local retouch, not a new portrait. Real current resemblance and minimal facial change are higher priorities than visual glamour.
