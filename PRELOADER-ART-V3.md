# Aligned portrait revision

Unreleased draft: superseded by the owner's natural-color selection and localized chin edit in PRELOADER-ART-V4.md. The transparent-cutout monochrome proposal below was not deployed.

Built-in imagegen, October 22, 2026. The original real photograph is the identity reference; the owner's poster defines the left-facing torso/head alignment. Body pose now has a dominant near shoulder at viewer right and a receding far shoulder at left. Generative identity remains approximate; this is not an exact photographic reconstruction.

Selected assets: output/canva/Tanzamul-Portrait-Poster.png (natural-color poster), output/canva/Tanzamul-Portrait-Transparent.png (transparent portrait), output/canva/Tanzamul-Signature-Transparent.png (existing signature). The separately generated navy regrade was not selected because it introduced stronger artificial skin texture. The selected natural-color cutout receives a reversible CSS monochrome tint on the website. Background removal used imagegen; Sharp only encodes responsive WebP sizes at quality 90, alpha quality 100.

Production: public/images/intro/tanzamul-turned-v3-{480,800,1122}.webp, with existing signature motion. The flat panel uses CSS #FBC52B, avoiding a baked orange gradient. Stage height is min(64svh,96vw,600px), smaller than the previous 74svh/680px stage. Existing four-edge masks, skip/accessibility behavior and immutable caching remain.

## Pose / identity prompt

Use case: identity-preserve / precise-object-edit.
Asset: high-resolution clean portrait plate for a personal portfolio intro, portrait 4:5 aspect, aim for 1600x2000 or higher native detail.
INPUT ROLES: Image 1 is the REAL photograph, sole facial-identity reference. Image 2 is the REQUIRED BODY POSE AND COMPOSITION reference. Image 3 is the CURRENT poster to correct, NOT an identity reference.
REQUEST: correct the torso orientation in image 3 to match image 2 while improving faithful real-person facial detail from image 1. Head AND torso must both face toward viewer's LEFT, not front-on with only a rotated neck. Torso is turned about 35-45 degrees toward viewer's left; the shoulder on viewer's RIGHT is the large near shoulder and projects forward/dominates the lower-right. The far shoulder on viewer's LEFT recedes, is narrower and lower. Shirt opening, sternum and lapels angle toward left; do not show symmetrical frontal lapels, centered straight shirt placket or level symmetrical shoulders. Follow image 2's shoulder slope and body orientation closely. Head three-quarter left, chin gently raised, gaze upward-left, aligned naturally with chest. Keep neck natural and shorter than image 3; no stretched neck or exaggerated jaw.
IDENTITY: preserve the actual man in image 1, same nose shape/projection, lips, chin width, jaw, ear, beard distribution, forehead and original swept-back hair. Same dark rectangular sunglasses and black suit/light open-collar shirt. Improve realistic facial detail and natural skin texture, avoid the swirled engraved/waxy texture visible in image 3. Faithful anatomy above stylization. No borrowing Neymar's features, no tattoos or earrings.
FRAMING: tight head and upper chest, full hair within frame; hair begins 8-10% from top, head centered slightly left. Near shoulder fills lower-right, far shoulder lower-left. No hands, waist, belt or arms. Leave lower chest free for a separately animated signature. Keep all face well above lower 30%.
COLOR: restrained cool navy monochrome portrait with realistic silver-gray highlights; preserve natural texture. Behind head, flat softer clean sunshine yellow rectangle #FBC52B (avoid dark orange/mustard, heavy saturated gradient or yellow glow). Match the lighter yellow character of image 2. Panel spans x16% to84%, y6% to69%, behind head and shoulders. Surrounding background is uniform nearly-black #09090b, no texture/no white border. Bottom suit fades gently into same #09090b.
TEXT: absolutely none, no signature, no WELCOME, no watermark; these are animated separately.
Priorities: torso and head face same leftward direction like image 2; real subject likeness from image 1; natural fine facial texture; softer yellow panel; keep polished editorial close-up.

## Transparent cutout prompt

Use case: background-extraction.
Extract the man from this EXACT supplied image as a clean transparent PNG, preserve the original canvas dimensions 1122x1402 and exact position and scale inside it. Remove only the yellow rectangle and all dark background. Keep the real photographic natural colors of the face, skin, sunglasses, hair, black suit and light blue shirt exactly as they are. Do not recolor, stylize, smooth, etch, engrave, sharpen, beautify, or redraw the face or any part of the person. Do not change hair/head/neck/torso/shoulder orientation at all. Keep the angled chest facing viewer's left, large near shoulder on viewer's right, smaller receding far shoulder at left. All subject pixels should match the reference as closely as possible, particularly facial likeness and natural skin.
Background must be genuine transparent alpha. Keep original margins with subject at identical coordinates and full hair. Only remove background, no text, no new design. This is a transparent layer for compositing behind a CSS yellow rectangle and applying a reversible browser monochrome filter.

## Unselected regrade prompt

Use case: lighting-weather / style-transfer.
Make ONE tightly constrained color-grade edit to the supplied image. Preserve EXACTLY the subject's face, facial anatomy, expression, upward-left head pose, aligned leftward torso pose, shoulder slope, suit, crop, hair, sunglasses, background geometry and all composition.
Change ONLY the person (skin, hair, shirt and suit) to a refined navy/silver monochrome photographic duotone, like a premium editorial portrait: luminous silver-gray skin highlights, restrained midnight-blue shadows, dark navy suit. Keep the natural photographic texture and actual face; avoid etched/swirl patterns, plastic smoothing or oversharpening. Do not redraw or beautify the face.
Keep the yellow rectangle but make it flatter and softer, light sunshine yellow around #FBC52B, not orange/mustard and not a glowing gradient. Keep the outside background uniform #09090b, feather bottom gently into it. No text, no signature, no WELCOME. No resizing or reframing. Exact same identity and body orientation.
