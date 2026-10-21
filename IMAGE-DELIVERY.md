# Image delivery

All current public raster content uses prepared local images: project cards and case studies, blog cards and articles, hero portrait, chat avatar, and achievement cards/galleries. The activities gallery retains its already prepared previews. Original files are preserved, including full certificate and team-photo links. Favicons and SVG artwork are not rasterized.

## Preparation and quality

`npm run images:prepare` collects local raster paths from content, generates WebP variants at useful widths without upscaling, and writes an ignored manifest. Quality is 90; an existing full-size WebP is copied byte-for-byte instead of recompressed. File identity includes source bytes, transformation version, quality and encoder versions. Sizes and aspect ratios are retained. A tiny blur preview avoids blank image wells while the actual file arrives.

The initial preparation covers 19 sources (14.62 MiB originals), with about 0.77 MiB combined for their 640px/card-size variants. This is an asset comparison, not a measured page-load score. Desktop and high-density screens select larger variants through responsive `srcset`/`sizes`.

The hero retains high fetch priority. Below-fold media retains lazy loading; an expensive runtime AVIF conversion is no longer required for current content. The project preview's artificial 700 ms opacity delay was removed. Direct video posters also use prepared media. New uploads missing from the manifest fall back to Next's WebP encoder until the next build regenerates the manifest.

`npm run images:check` verifies file existence, actual decoded dimensions, aspect ratios, non-upscaling, alpha preservation when present, and byte counts. The repository's build/dev/typecheck hooks prepare images automatically. Generated outputs are not checked into Git. Sharp is an explicit pinned dependency.

`python scripts/check-image-delivery.py` checks six rendered routes, every responsive image URL they reference, immutable cache headers, ETags and HTTP 304. Candidate deployments run this check before switching traffic. Production dependency audit (`npm audit --omit=dev`) reported zero findings during this change; the existing development-tool audit findings are outside this image-delivery change. This is not a claim of a complete security audit or a browser performance score.

## Local icons and social image

51 technology SVG icons are committed locally, unchanged from their recorded CDN sources. `scripts/cache-tech-icons.mjs` is an explicit refresh command; builds do not depend on the icon CDN. Two unavailable upstream icons keep the existing local initial fallback. The social sharing image is also local and versioned.

## Caching and deployment

`ops/tanzamul-image-delivery.conf` serves only immutable image derivatives, hashed SVG icons and Next static assets directly through Nginx. Browser cache TTL is one year, with ETags for conditional requests. Shared asset directories retain older hashes, so open pages and rollbacks can still load their media after a deployment. HTML, API responses and authenticated/admin pages are not given this public asset cache.

The Next fallback image cache uses a persistent Docker volume, a 31-day minimum TTL, a 128 MB disk-cache limit, and a 10 MB source-response limit. This is bounded fallback storage, not a CDN. The original image allowlist remains enforced.

After building the image, run `sudo bash scripts/deploy-portfolio.sh tanzamul-portfolio:TAG FREE_LOOPBACK_PORT` on the existing VM source folder. The script validates its image/port arguments, checks free disk space, starts and checks a candidate, copies hashed assets to the shared Nginx directory, tests Nginx, switches traffic, and retains the preceding container/config for rollback. It only changes the tanzamul.dev deployment. No secrets belong in this repository.

No paid CDN, image SaaS or new VM is introduced. Normal VM, provisioned disk and internet-transfer billing still applies. Smaller images and repeat-visit browser caching can reduce transferred bytes; a dollar saving cannot be promised without measuring actual traffic and the billing account's credits/allowances. Keep adequate disk headroom for future builds and manage old Docker rollback images separately.
