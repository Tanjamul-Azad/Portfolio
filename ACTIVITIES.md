# Activities & hackathons

The section is implemented in `src/components/sections/activities.tsx`, after Achievements on the homepage, with a navigation link. Until real event records are supplied in `src/content/activities.json`, it shows a compact editorial introduction without fictional events, awards, or counts.

Select roughly 3–6 substantial experiences. Include a non-winning participation when it demonstrates a meaningful prototype, technical contribution, collaboration, finalist selection, or useful learning. Keep formal awards in Achievements; describe the process and contribution here without repeating the same award card.

Each record needs:

- `id`: stable, unique slug
- `name`: event name
- `date`: actual event date in YYYY-MM-DD format
- `category`: Hackathon, Community, Leadership, or Volunteering
- `role`: your actual contribution/role
- `summary`: what you did and built
- Optional: `project`, `outcome`, `learning`, `tags`, `url`, `image`, `imageAlt`

Use an explicit outcome such as Participant, Finalist, or the exact prize only when accurate. Use real event photographs or certificates, not generated participation evidence. A date, event/project link, role, and tangible result are more useful than a long list of attendance badges.

Current Priorities (`src/content/now.json`) now lists Dawat, the NASA-focused CLPS project, and a personalized AI habit tracker; research lists MCP security and ongoing FYDP. Looking For is unchanged.
