# Text-free About portrait — October 23, 2026

The owner requested removing the embedded gold handwritten name from the former Hero portrait now used in About. The built-in imagegen tool edited the approved `public/images/hero-portrait-current-v2.png`; the selected output is saved non-destructively as `public/images/about-portrait-clean-v1.png`. The original portrait and separate Hero signature animation remain unchanged.

`src/content/portraits.json` selects the About asset and lets the existing build pipeline prepare quality-90 responsive WebP variants. About copy, framing and layout are unchanged. The owner-reviewed version was deployed to tanzamul.dev on October 23, 2026 as part of the signature Hero release; see DEPLOYMENT.md.

## Final prompt (built-in imagegen)

Use case: precise-object-edit, identity-preserve. Edit target: the single attached existing approved portrait. Remove ONLY the yellow/gold handwritten 'Tanzamul' signature across the lower torso, reconstructing the underlying black denim jacket, black turtleneck, folds and shadows naturally. This is localized text removal/inpainting, not a new portrait. Keep every other element exactly as in the input: the same person's EXACT face, eyes, nose, mouth, chin, beard, skin texture and facial expression; same hairstyle, proportions, pose, hands, jacket seams/buttons/pockets, framing, original portrait aspect ratio and resolution, black background and lighting. Do not retouch, beautify, sharpen, regenerate or change the face or upper body. Only pixels in and immediately adjacent to the gold signature should change. No text, logo, signature, watermark or new details. Return the complete original-framing portrait with a clean text-free lower jacket.
