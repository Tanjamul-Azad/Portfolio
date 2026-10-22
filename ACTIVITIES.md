# ExtraCurricular

## Owner-supplied evidence — October 22, 2026

HSIL, IBM Bob and Infinity's compact outcome badges now link directly to the supplied evidence. The Details dialog repeats clearly labelled proof links, preserves existing posters/photos and adds an optional related-project link. Card order and the compact desktop/mobile layout are retained.

- HSIL: owner-provided event photo for RadFlow: https://www.facebook.com/photo/?fbid=122258276252179644&set=pcb.122258278160179644. Existing selection confirmation and team photo remain in the gallery.
- IBM Bob: owner associates Team DIP's AI Orchestrator submission/demo with this entry: https://lablab.ai/ai-hackathons/ibm-bob-hackathon/team-dip/orchestrator-unified-ai-cli-development-platform. This is also the AI Orchestrator project's demo link. The supplied URL names the IBM Bob event without `2`; the existing event edition/date was not independently re-established from that submission. Do not infer new prizes or selection claims.
- Infinity AI BuildFest: owner associates RadFlow Bangladesh with the preliminary round. The uploaded certificate explicitly states **participation in the preliminary round**. Verification: https://cloudcampbd.com/verify/b6a3f3ed94ca510a0971848b. The original 2000×1414 PNG is retained; the modal uses a 1280px WebP preview (103,774 bytes), with full-image and certificate-download actions. No certificate is fetched by the collapsed card.

The original certificate is `public/images/activities/infinity-participation-2026-v1.png`. Regenerate the preview using `node scripts/prepare-activity-images.mjs`. These are real owner-supplied materials; nothing was generated or altered beyond image compression/resizing. The external pages were not readable through the web tool (Facebook throttled; lablab timed out; certificate verification inaccessible), so they are presented as owner-provided evidence links rather than independently verified claims.

The section is implemented in `src/components/sections/activities.tsx`, after Achievements on the homepage, with a navigation link. Four owner-supplied event records are stored in `src/content/activities.json`. The cards emphasize participation and contribution, without prizes or rankings.

Select roughly 3–6 substantial experiences. Include a non-winning participation when it demonstrates a meaningful prototype, technical contribution, collaboration, finalist selection, or useful learning. Keep formal awards in Achievements; describe the process and contribution here without repeating the same award card.

Each record needs:

- `id`: stable, unique slug
- `name`: event name
- `date`: verified event date in YYYY-MM-DD format, or YYYY when only the edition is known
- `category`: Hackathon, Community, Leadership, or Volunteering
- `role`: your actual contribution/role
- `summary`: what you did and built
- Optional: `endDate`, `dateLabel`, `project`, `outcome`, `learning`, `tags`, `url`, `image`, `imageAlt`, `imageLabel`, `imageSource`, `imageWidth`, `imageHeight`, `thumbnail`, `preview`, `gallery`

Use an explicit outcome such as Participant, Finalist, or the exact prize only when accurate. Use real event photographs or certificates, not generated participation evidence. A date, event/project link, role, and tangible result are more useful than a long list of attendance badges.

Current Priorities (`src/content/now.json`) now lists Dawat, PolarWindow, the independent CLPS lunar mission browser, and a personalized AI habit tracker; research lists MCP security and ongoing FYDP. Looking For is unchanged.

## Current entries and date sources

- NASA International Space Apps Challenge: owner confirmed the ongoing 2026 edition and local selection with PolarWindow, progressing to the global stage. The local date/region was not supplied, so the card shows **2026 · Ongoing**. The official homepage currently advertises the global event for November 14–15, 2026; those dates are not represented as the owner's local participation dates. No global finalist/winner claim is made. Source: https://www.spaceappschallenge.org/
- IBM Bob 2.0 Hackathon: September 25–27, 2026, as listed by IBM Developer. Participation only; no project or specific technical contribution supplied. Source: https://developer.ibm.com/events/ibm-bob-20-hackathon/
- The Infinity AI BuildFest: June 12, 2026, the event day listed in the organizer's event catalogue (program ran May 1–June 12). Participation only. Sources: https://cloudcampbd.com/events-public and https://cloudcampbd.com/the-infinity-ai-buildfest
- Harvard HSIL Hackathon: April 10–11, 2026, Dhaka hub at UIU, as listed by IRIIC. Owner supplied national selection and RadFlow association. The supplied selection confirmation and team photograph are displayed in the detail gallery. Source: https://iriic.uiu.ac.bd/harvard-hsil-hackthon-2026/

Selection and participation statuses are the owner's account; event pages establish dates and context, not verification of the owner's personal attendance. Cards are ordered with the ongoing NASA activity first and HSIL second at the owner's request, followed by IBM Bob and Infinity AI BuildFest. Only real owner-provided event photos/certificates should be added later.

## Posters and detail gallery

Cards share the blog's compact 3/4-column desktop grid and mobile swipe layout. Details opens an accessible, scrollable dialog with the full description and uncropped images. Full-size images can also be opened separately. Case-study navigation is removed from this section. The HSIL selection confirmation and team photo are owner-supplied; official promotional artwork is labelled separately from personal participation evidence.

- NASA cover: https://assets.spaceappschallenge.org/media/images/THE_NEXT_FRONTIER_V3_Website_1.width-1024.png — linked from the official 2026 theme announcement.
- IBM Bob cover: https://storage.googleapis.com/lablab-static-eu/events/IBM-BOB-2-0-Hackathon_Main_banner_-03--2-_xoi067ee0t95d0dbb2ranc89.jpg — official lablab event page linked by IBM Developer.
- Infinity AI BuildFest cover: the organizer's public event summary `og_image_url`, downloaded from https://tsqgdkytytvunvyguinh.supabase.co/storage/v1/object/public/event-assets/og/8af579fc-a625-41a0-9237-78cda4f4223f/cover .
- HSIL cover: https://iriic.uiu.ac.bd/wp-content/uploads/2025/12/HSIL-Hackathon-7th-Edition-7.png — official 2026 poster on the UIU event page. The separate selection confirmation and team photo appear only inside Details.

Original artwork is retained without generated replacements or text alterations. Poster source links are available inside each event's Details dialog.

`scripts/prepare-activity-images.mjs` creates 640px WebP card images and up-to-1280px gallery previews with Sharp. The four card images total 110,238 bytes. Thumbnails are served directly with immutable caching, start loading eagerly at low fetch priority, and avoid runtime image-conversion latency. Gallery media mounts only when Details opens; original files remain available via full-image links. New derivatives have versioned filenames to avoid stale browser caches. No certificate or team photo is fetched by the collapsed HSIL card.
