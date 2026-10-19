# Google Cloud deployment

Production: https://tanzamul.dev

- Project: `virtual-machine-512107`
- VM: `deployments`, zone `us-central1-f`
- Reserved address: `deployments-ip`, `35.232.136.37`
- Source folder on VM: `/home/User/tanzamul-portfolio`
- Container: `tanzamul-portfolio`, bound to `127.0.0.1:3001`
- Nginx site: `/etc/nginx/sites-available/tanzamul.dev`
- TLS: Certbot with automatic renewal (`certbot.timer`)
- Runtime secrets: `/home/User/tanzamul-runtime.env`, mode 600. Never commit this file.

Build on Linux with `sudo docker build -t tanzamul-portfolio:latest .`.
The image uses Next.js standalone output; local Windows node_modules are not uploaded.
Run with `sudo docker run -d --name tanzamul-portfolio --restart unless-stopped --memory=768m --memory-swap=1g --cpus=1 --env-file /home/User/tanzamul-runtime.env -p 127.0.0.1:3001:3000 tanzamul-portfolio:latest`. The current deployed image is `tanzamul-portfolio:deep-articles`. Include the Search Console verification file from `public/` in the image and keep it accessible after updates.
For later updates, build before replacing the running container, retain the previous image for rollback, and check the homepage and `/sitemap.xml` afterward.

The existing ahbab.dev containers use different ports and Nginx server names.
Production admin credentials and GitHub write tokens are deliberately excluded from the runtime environment.

Billing: a $15 monthly gross-cost budget emails billing administrators/users at 50%, 80%, and 100%. It is an alert, not a spending cap. A weekly Codex credit monitor warns at $30 remaining or unused credit expiry within 30 days.

SEO: canonical URL, sitemap, robots and structured data use tanzamul.dev. Both Tanzamul and Tanjamul are represented in alternate names. Search ranking and indexing are controlled by search engines; submit the sitemap in Google Search Console after verifying ownership.

Google Search Console ownership was verified on October 19, 2026; the sitemap was successfully processed with 17 discovered pages. Vercel project `portfolio` was deleted at the user's request. Its old URL now returns 404. HTTP and www URLs permanently redirect to the HTTPS root domain, retaining paths. The stopped `tanzamul-portfolio-pre-seo` container is retained for rollback and has automatic restart disabled.

Latest content restores the AI Engineer / Generative AI Researcher identity, adds five dark scientific blog illustrations with alt text, captions and image sitemap entries, updates Current Priorities, and provides an Activities & hackathons section awaiting the user's event details. See `BLOG-IMAGE-PROMPTS-V2.md` for current image provenance and `ACTIVITIES.md` for event content fields. The CV source and both PDF copies now point to tanzamul.dev. The stopped `tanzamul-portfolio-before-dark` container retains the preceding content version for rollback.

The homepage and blog index share image-first article cards. Desktop uses three columns from 1024px and four from 1280px; phones and tablets use a sideways snap carousel matching Projects. Cards use compact typography, spacing and two-line title/excerpt limits. Production build and TypeScript checks passed. ESLint passed with one existing React Hook Form / React Compiler warning in contact-form.tsx. The stopped `tanzamul-portfolio-before-deep` container preserves the version before the long articles and mobile carousel.

On October 20, 2026, 17 indexed URLs under the deleted tanjamul-azad.vercel.app deployment were submitted through Google's Refresh Outdated Content tool. All 17 requests were Pending when checked; submission does not mean the search results have already disappeared. The GitHub profile website and repository homepage now use tanzamul.dev.

Five articles were expanded to approximately 1,550–1,730 words each, with checked Python examples, primary references, explicit limitations, updated reading times and section navigation. See BLOG-EDITORIAL-NOTES.md for implementation evidence and the distinction between shipped project behavior and proposed improvements. All original blog URLs and publication dates are retained; the revision date is October 20, 2026.
