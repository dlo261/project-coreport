# CorePort build roadmap

## Phase 1 — Foundation and gated landing (done)
- [x] Brand tokens (palette, Inter + JetBrains Mono, status colours, logo mark), light/dark mode
- [x] Full schema + RLS + GRANTs as a versioned migration; append-only ledger triggers; balances as views
- [x] `profiles` + default role created by trigger on user creation; roles in a separate `user_roles` table
- [x] Seeded admin-editable config: pricing, tiers, service rates, availability modes, flags, status, legal, milestones
- [x] Email/password + magic-link auth
- [x] Server-enforced site password gate (`SITE_PASSWORD`, `SESSION_SECRET`), verified with a no-JavaScript request
- [x] Public landing page, legal pages, minimal header/footer, lock action
- [ ] Bot protection on signup (Turnstile/hCaptcha) — blocked: needs a Turnstile or hCaptcha site key + secret from the account owner
- [ ] Seed one admin user — blocked: needs the email address that should hold the admin role

## Phase 2 — Marketplace and customer experience
- [ ] Product pages, pricing page with the dated competitor table, status page, node download centre
- [ ] Filterable marketplace grid over `service_listings`
- [ ] Listing detail with live price estimate before deploy, reliability selector, hours slider
- [ ] Customer dashboard: deployments, logs, usage, recovery history
- [ ] Wallet top-up via hosted checkout ($20 suggested minimum), budget caps, auto-stop before zero
- [ ] Developer docs: quickstart, API keys, endpoint reference with curl examples
- [ ] Seed realistic illustrative nodes/benchmarks/deployments for demos

## Phase 3 — Provider experience
- [ ] Apply → KYC → pending/approved (no node live before approved)
- [ ] Agent download flow; node appears via signed webhook
- [ ] Availability modes; provider-set payout floors
- [ ] Ledger accrual, monthly payouts above the provider's threshold, new-provider hold
- [ ] Earnings estimator (gross ranges, tier reasoning, permanent disclaimer, reads `tier_config` + `service_rates`)

## Phase 4 — Admin panel
- [ ] KYC/payout queues with Connect status; pricing + tier config editors (audit-logged, expiring promos)
- [ ] Node trust and abuse review; reliability/incident dashboard; tickets and disputes
- [ ] CMS for legal + status content; audit log viewer; super-admin vs support-only split

## Phase 5 — CorePort Certified (post-launch)
- [ ] Certification as an earned, config-driven, revocable badge
- [ ] CorePort-operated capacity pool behind a pluggable infrastructure adapter

## Integrations still to wire
- [ ] Stripe Checkout + Connect Express, webhooks writing `ledger_entries`/`payouts` server-side
- [ ] Transactional email; node-agent signed webhook (service-role writes only)
- [ ] Sentry; product analytics
- [ ] Flagged for later: sales tax handling
