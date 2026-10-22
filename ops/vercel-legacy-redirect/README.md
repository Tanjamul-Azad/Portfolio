# Old portfolio hostname redirect

The owner's explicitly approved redirect sends every path on `tanjamul-azad.vercel.app` to the same path on `https://tanzamul.dev` using HTTP **308 Permanent Redirect**. The Google Cloud site remains the actual portfolio. This Vercel project contains no application server, credentials or portfolio copy.

Vercel scope: `imtanjamul-3836s-projects`.
Project: `tanzamul-legacy-redirect` (`prj_LnoDaXFlqjNTXt4Bhp5PTxyEktJw`).
Verified deployment: `tanzamul-legacy-redirect-h41o0yg8h-imtanjamul-3836s-projects.vercel.app`.

## Reproduce

Run from this directory, authenticated to the existing Vercel account:

```powershell
vercel link --yes --project tanzamul-legacy-redirect --scope imtanjamul-3836s-projects
node prepare.mjs
vercel deploy --prebuilt --prod --yes --scope imtanjamul-3836s-projects
vercel alias set <new-deployment-url> tanjamul-azad.vercel.app --scope imtanjamul-3836s-projects
```

Use the explicitly generated Build Output API routing configuration. The initial ordinary static deployment did not apply the intended redirect in live checks; the prebuilt deployment above was verified. The generated `.vercel` directory is ignored by Git.

This redirect-only project has Vercel Authentication disabled so anonymous visitors and crawlers can receive the redirect; this does not change authentication on other projects or the Google Cloud application.

## Verification — October 22, 2026

Anonymous HTTPS requests to `/`, `/projects`, `/blog/checking-real-actions-in-mcp-systems`, and `/projects/polarwindow?source=legacy` all returned 308 to the exact corresponding `https://tanzamul.dev` URL. Each destination returned 200. Query strings were preserved. No Vercel login is required.

Google needs to recrawl the old URLs before search results reflect the migration. A redirect does not immediately remove an old search result or guarantee rankings. Keep the redirect active during migration; Google recommends keeping redirects for at least a year: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes.
