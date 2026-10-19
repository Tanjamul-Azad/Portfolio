# ExtraCurricular

The section is implemented in `src/components/sections/activities.tsx`, after Achievements on the homepage, with a navigation link. Four owner-supplied event records are stored in `src/content/activities.json`. The cards emphasize participation and contribution, without prizes or rankings.

Select roughly 3–6 substantial experiences. Include a non-winning participation when it demonstrates a meaningful prototype, technical contribution, collaboration, finalist selection, or useful learning. Keep formal awards in Achievements; describe the process and contribution here without repeating the same award card.

Each record needs:

- `id`: stable, unique slug
- `name`: event name
- `date`: verified event date in YYYY-MM-DD format, or YYYY when only the edition is known
- `category`: Hackathon, Community, Leadership, or Volunteering
- `role`: your actual contribution/role
- `summary`: what you did and built
- Optional: `endDate`, `dateLabel`, `project`, `projectUrl`, `outcome`, `learning`, `tags`, `url`, `image`, `imageAlt`

Use an explicit outcome such as Participant, Finalist, or the exact prize only when accurate. Use real event photographs or certificates, not generated participation evidence. A date, event/project link, role, and tangible result are more useful than a long list of attendance badges.

Current Priorities (`src/content/now.json`) now lists Dawat, PolarWindow, the independent CLPS lunar mission browser, and a personalized AI habit tracker; research lists MCP security and ongoing FYDP. Looking For is unchanged.

## Current entries and date sources

- NASA International Space Apps Challenge: owner confirmed the ongoing 2026 edition and local selection with PolarWindow, progressing to the global stage. The local date/region was not supplied, so the card shows **2026 · Ongoing**. The official homepage currently advertises the global event for November 14–15, 2026; those dates are not represented as the owner's local participation dates. No global finalist/winner claim is made. Source: https://www.spaceappschallenge.org/
- IBM Bob 2.0 Hackathon: September 25–27, 2026, as listed by IBM Developer. Participation only; no project or specific technical contribution supplied. Source: https://developer.ibm.com/events/ibm-bob-20-hackathon/
- The Infinity AI BuildFest: June 12, 2026, the event day listed in the organizer's event catalogue (program ran May 1–June 12). Participation only. Sources: https://cloudcampbd.com/events-public and https://cloudcampbd.com/the-infinity-ai-buildfest
- Harvard HSIL Hackathon: April 10–11, 2026, Dhaka hub at UIU, as listed by IRIIC. Owner supplied national selection and RadFlow association. Certificate and group photograph are available from the owner but have not yet been provided or displayed. Source: https://iriic.uiu.ac.bd/harvard-hsil-hackthon-2026/

Selection and participation statuses are the owner's account; event pages establish dates and context, not verification of the owner's personal attendance. Cards are ordered with the ongoing NASA activity first, followed by dated events from newest to oldest. Only real owner-provided event photos/certificates should be added later.
