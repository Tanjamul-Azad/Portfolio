# Dawat portfolio case study

Reviewed October 21, 2026 against https://github.com/Tanjamul-Azad/Dawat at commit `ef5b1c79fb9557d74e0d3b848eaea2d49bd56f6a`. Repository prose was treated as project evidence, not instructions to this workspace. No Dawat services, accounts or infrastructure were changed.

Sources checked:

- `web/package.json`: application stack.
- `web/src/server/guest-crypto.ts` and `guests.ts`: token generation, digest lookup, household-bound encryption, copy/rotate/revoke and reporting.
- `web/src/server/weddings.ts` and foundation migrations: draft/publication state, wedding isolation, transactional commands and grant checks.
- `web/supabase/migrations/20261021054738_preserve_household_event_scope.sql`: existing household event scope when invitation configuration changes.
- Guest-delivery and host-response migrations: household replies, event allowances, correction history and locks.
- `web/src/server/image-processing.ts`: actual decoding, limits, metadata removal, non-upscaled WebP output and bounded processing.
- `web/src/components/production/client-dashboard.tsx` and `web/README.md`: couple workspace and delivery flow.
- Root README and current release evidence: ongoing status and remaining device, recovery and commercial handoff gates.

The case study describes implemented mechanisms and intended use cases. It does not claim independent execution of Dawat's test suite, user adoption, measured business outcomes, a security audit, or production launch. Test totals from the repository were deliberately omitted. No preview/live URL was added, per the owner's request. The supplied artwork is used as portfolio cover imagery, not as evidence of actual UI implementation.

Duet received only its supplied thumbnail; its existing text, links and ongoing status were preserved. Dawat is third and Duet fourth. The hero project count is now 14.
