# Google Cloud deployment

Production: https://tanzamul.dev

- Project: `virtual-machine-512107`
- VM: `deployments`, zone `us-central1-f`
- Reserved address: `deployments-ip`, `35.232.136.37`
- Source folder on VM: `/home/User/tanzamul-portfolio`
- Container: `tanzamul-portfolio`, bound to `127.0.0.1:3004`
- Nginx site: `/etc/nginx/sites-available/tanzamul.dev`
- TLS: Certbot with automatic renewal (`certbot.timer`)
- Runtime secrets: `/home/User/tanzamul-runtime.env`, mode 600. Never commit this file.

Build on Linux with `sudo docker build -t tanzamul-portfolio:latest .`.
The image uses Next.js standalone output; local Windows node_modules are not uploaded.
Run with `sudo docker run -d --name tanzamul-portfolio --restart unless-stopped --memory=768m --memory-swap=1g --cpus=1 --env-file /home/User/tanzamul-runtime.env -p 127.0.0.1:3004:3000 tanzamul-portfolio:latest`. The current deployed image is `tanzamul-portfolio:activities-content`. Include the Search Console verification file from `public/` in the image and keep it accessible after updates.
For later updates, build before replacing the running container, retain the previous image for rollback, and check the homepage and `/sitemap.xml` afterward.

The existing ahbab.dev containers use different ports and Nginx server names.
Production admin credentials and GitHub write tokens are deliberately excluded from the runtime environment.

Billing: a $15 monthly gross-cost budget emails billing administrators/users at 50%, 80%, and 100%. It is an alert, not a spending cap. A weekly Codex credit monitor warns at $30 remaining or unused credit expiry within 30 days.

SEO: canonical URL, sitemap, robots and structured data use tanzamul.dev. Both Tanzamul and Tanjamul are represented in alternate names. Search ranking and indexing are controlled by search engines; submit the sitemap in Google Search Console after verifying ownership.

Google Search Console ownership was verified on October 19, 2026; the sitemap was successfully processed with 17 discovered pages. Vercel project `portfolio` was deleted at the user's request. Its old URL now returns 404. HTTP and www URLs permanently redirect to the HTTPS root domain, retaining paths. The stopped `tanzamul-portfolio-pre-seo` container is retained for rollback and has automatic restart disabled.

Latest content restores the AI Engineer / Generative AI Researcher identity, adds five dark scientific blog illustrations with alt text, captions and image sitemap entries, updates Current Priorities, and provides an Activities & hackathons section awaiting the user's event details. See `BLOG-IMAGE-PROMPTS-V2.md` for current image provenance and `ACTIVITIES.md` for event content fields. The CV source and both PDF copies now point to tanzamul.dev. The stopped `tanzamul-portfolio-before-dark` container retains the preceding content version for rollback.

The homepage and blog index share image-first article cards. Desktop uses three columns from 1024px and four from 1280px; phones and tablets use a sideways snap carousel matching Projects. Cards use compact typography, spacing and two-line title/excerpt limits. Production build and TypeScript checks passed. ESLint passed with one existing React Hook Form / React Compiler warning in contact-form.tsx. The stopped `tanzamul-portfolio-before-mcp` container preserves the version before the general MCP security article.

On October 20, 2026, 17 indexed URLs under the deleted tanjamul-azad.vercel.app deployment were submitted through Google's Refresh Outdated Content tool. All 17 requests were Pending when checked; submission does not mean the search results have already disappeared. The GitHub profile website and repository homepage now use tanzamul.dev.

Five articles were expanded to approximately 1,550–1,730 words each, with checked Python examples, primary references, explicit limitations, updated reading times and section navigation. See BLOG-EDITORIAL-NOTES.md for implementation evidence and the distinction between shipped project behavior and proposed improvements. All original blog URLs and publication dates are retained; the revision date is October 20, 2026.

The homepage and /blog preview show four articles. View all opens /blog/all, which lists the complete collection. The archive has its own canonical metadata and sitemap entry; mobile swipe and desktop compact columns apply to both views.

A sixth, general MCP security tutorial was added with an imagegen cover. It uses public protocol/security references and a fictional example, without unpublished project/paper identities, links or experimental results. Research venues and existing research cards are unchanged. The preview still shows four articles; the complete archive now contains six.

The project showcase now contains 13 projects. PolarWindow is first, Complete Legal Aid second, and Duet third in both the homepage and project archive. PolarWindow and Duet carry an In development badge and a separate personal-contribution section. PolarWindow is presented as an independent NASA Space Apps / CLPS exploration project; the owner's contribution is research and mission analysis, with frontend work planned next. Duet is a solo full-stack build. UIU CGPA Calculator and UIU Cover Page Generator appear as smaller utilities. The four new projects intentionally have no thumbnail or live URL until the owner provides them; source links and case-study pages are available. Current Priorities now names PolarWindow, and the hero counts 13 Projects Showcased rather than treating ongoing work as shipped.

The project showcase update was initially deployed on localhost port 3002 behind the existing Nginx domain. The stopped `tanzamul-portfolio-before-projects` container retains the preceding version on port 3001 with automatic restart disabled. To roll back, start that container, restore the domain proxy to port 3001, test Nginx configuration, and reload Nginx before stopping the new container.

The section heading and shared navigation label are now ExtraCurricular; the existing #activities anchor is retained. Below 1024px the header uses the mobile menu so the longer label fits cleanly. At the time of the label update, event records were awaiting the owner's list. That version used localhost port 3003. The stopped `tanzamul-portfolio-before-extracurricular` container preserves the project-showcase version on port 3002 with automatic restart disabled; restore the domain proxy to port 3002 to roll back after starting that container.

Four ExtraCurricular event cards are now populated from the owner's participation list: NASA Space Apps 2026 with PolarWindow (local selection, progressing to the global stage), IBM Bob 2.0 (September 25–27, 2026, participation), Infinity AI BuildFest (June 12, 2026, participation), and Harvard HSIL (April 10–11, 2026, national selection with RadFlow). NASA shows 2026 / Ongoing because the local date was not provided. Selection and participation use neutral badges; no prizes, rankings, or global finalist claims are shown. Event links and two related project case studies are available. The HSIL card uses the owner's official selection confirmation as the cover image and reveals the supplied RadFlow team photo on desktop hover. Date-source notes are in ACTIVITIES.md.

The current activities-content version uses localhost port 3004. The stopped `tanzamul-portfolio-before-activities-content` container preserves the preceding version on port 3003 with restart disabled. To roll back, start that container, restore the tanzamul.dev Nginx proxy to port 3003, test and reload Nginx, then stop the newer container.
