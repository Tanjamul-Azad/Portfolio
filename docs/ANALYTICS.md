# Optional GA4 analytics

Website: https://tanzamul.dev

Owner-provided web stream: **Tanzamul Azad**, stream ID **16179602501**, measurement ID **G-Z5RCKZXZLX**. The public measurement ID lives in `src/content/analytics.json`; no API secret or Google account credential is needed in the app.

## Behavior

- GA4 loads only after the visitor explicitly allows analytics. The footer links to privacy information and analytics preferences. Declining/revoking consent stops this integration and clears accessible GA cookies. Do Not Track and Global Privacy Control are respected; admin routes are excluded.
- Page views use the current path without query strings or fragments. Client navigation records one manual page view per changed path. Advertising storage, Google signals and ad personalization are disabled in code.
- Existing project actions, article opens, CV downloads, outbound domains, email/WhatsApp/contact actions, successful contact submissions and CLS/INP/LCP measurements use a limited parameter list. Contact names, addresses and message contents are never added to custom events.
- `web-vitals` loads only after analytics consent. Its CLS value is multiplied by 1,000; INP/LCP values are milliseconds. These are consenting visitors' measurements, not a substitute for Search Console's field-data report.
- Removed the unused Vercel Analytics dependency. No additional VM, CDN, cloud disk or paid analytics plan is provisioned by this integration.

## Required account settings and verification

Owner screenshots supplied October 22, 2026 subsequently confirm **LINK CREATED** for the `https://tanzamul.dev/` Search Console property and the matching web stream. Realtime shows 2 active users, 3 `page_view` events and 3 `web_vitals` events. This confirms data receipt and the Search Console link; it does not establish absence of duplicate events across every navigation or independently confirm Enhanced measurement settings.

1. Keep **Enhanced measurement OFF** on this stream, since page views and interactions are sent by this application. The owner was instructed to disable it; the account setting still needs visual confirmation.
2. Open the live site, choose **Allow analytics**, browse to one article/project, and check **Reports → Realtime** for received events. Check that an initial visit and client navigation each yield one page view. Browser blockers may prevent collection. A deployed tag alone does not prove that Google has received data.
3. Link the matching Search Console property from **Admin → Product links → Search Console links** using an account with sufficient access. This is separate from installing GA4.
4. Keep account-level Google signals/advertising collection disabled unless explicitly needed; review retention and data sharing in the Analytics account. The application's configuration cannot establish these account-side settings.
5. Search Console already reports a successful sitemap and an indexed canonical homepage in the owner's screenshots. GA4 does not itself improve rankings or guarantee search visibility.

## Checks

`node scripts/check-telemetry.mjs` tests the consent/privacy boundary without sending network traffic: absent/revoked consent, Do Not Track, Global Privacy Control, admin exclusion, initialization, parameter filtering, clean URLs, storage failures and server rendering.

Official setup: https://support.google.com/analytics/answer/9304153

Search Console linking: https://support.google.com/analytics/answer/10737381
