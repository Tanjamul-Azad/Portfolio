# Portfolio Studio — the built-in content editor

Edit every part of your portfolio through a form-based UI instead of editing code.
No database, no external services. It runs **only on your computer** during
development and is **completely disabled (404) on the live site**, so it's never
exposed publicly.

## One-time setup

1. Open `.env.local` (create it if missing — it's gitignored) and add:

   ```
   ADMIN_PASSWORD=your-strong-secret-password
   # optional but recommended — sign the session cookie:
   ADMIN_SESSION_SECRET=<random 64-char hex>
   ```

   Generate a session secret:

   ```
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. Restart the dev server if it was already running.

## Editing

1. `npm run dev`
2. Go to **http://localhost:3000/admin** and log in with `ADMIN_PASSWORD`.
3. Edit anything:
   - **Site & SEO** — name, page title/description, social links, contact, OG image
   - **Hero** — headline lines, availability badge, buttons, profile video/photo
   - **About / Bio** — paragraphs (Markdown `**bold**`), personality badge, quote
   - **Now & Sections** — current priorities + Now/Contact section copy
   - **Projects** — cards, cover image, full case study, pinned/featured, ordering
   - **Blog** — posts with Markdown content + live preview
   - **Certificates & Awards**, **Experience**, **Tech Stack**, **Testimonials**
4. **Save** writes the change into the project's content files
   (`src/content/*.json`) and uploaded images into `public/images/...`.
5. Refresh the public site to preview your changes locally.

## Publishing

Changes are live-previewable locally immediately, but the deployed site only
updates when you push:

```
git add -A
git commit -m "content: update portfolio"
git push
```

Vercel rebuilds automatically and your edits go live.

## Notes

- **Images & video**: each image field can either upload a file (saved under
  `public/images/<area>/`) or accept a pasted URL.
- **Slugs**: project/blog slugs power their page URLs (`/projects/<slug>`,
  `/blog/<slug>`) and must be unique — the editor warns on duplicates.
- **Reordering**: use the ▲ ▼ buttons. Project order also controls which pinned
  projects appear first on the homepage.
- **Adding a new project/blog post**: appears locally right away; on the live
  site it shows after the next `git push` (the static pages are rebuilt then).
- **Security**: the editor 404s entirely in production and requires your password
  in development. Never commit `.env.local`.
