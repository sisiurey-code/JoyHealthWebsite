# Joy Health

[joyhealth.cc](https://joyhealth.cc) publishes plain-language nutrition
guides that cite their sources.

The current site serves static educational content and store redirects, without
accounts, forms, or a customer health database. Content and code remain
reviewable in Git, and the site deploys directly to Cloudflare Workers.

## Local development

Requires Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Before submitting a change, run:

```bash
npm run check
```

## Cloudflare deployment

Production is defined by `wrangler.jsonc` and deploys the Vinext build output
to the `joy-health` Worker. Cloudflare Workers Builds should use:

```text
Production branch: main
Build command: npm run check
Deploy command: npm run deploy:worker
Non-production branch builds: disabled
```

The Worker configuration owns the `joyhealth.cc` and `www.joyhealth.cc`
Custom Domains. Cloudflare creates their DNS records and certificates during
deployment. The application permanently redirects `www` and HTTP requests to
`https://joyhealth.cc`.

To validate the deploy package without publishing, run:

```bash
npm run build
npx wrangler deploy --dry-run --config dist/server/wrangler.json
```

For an authenticated local release, `npm run deploy` runs the full quality gate
before publishing the generated Worker bundle.

## Content quality

- Cite and characterize health evidence accurately.
- Never imply medical credentials or individualized medical advice.
- Prefer useful original synthesis over search-targeted content volume.
- Keep pages server-rendered, accessible, and lightweight by default.

The public editorial standards are published at
[joyhealth.cc/standards](https://joyhealth.cc/standards). Release verification
and Search Console monitoring are documented in
[docs/SEO_OPERATIONS.md](docs/SEO_OPERATIONS.md). How supplement labels were
transcribed and how to re-check them is in
[docs/SUPPLEMENT_LABELS.md](docs/SUPPLEMENT_LABELS.md).

## Representatives and store links

Every store link points at `/go/usana`, or at `/go/usana/<product>` for one
product's store page (item numbers are in `app/lib/reps.ts`). The Worker
redirects it to the store of one independent USANA representative listed in
`app/lib/reps.ts`:

- a personal link such as `https://joyhealth.cc/?rep=sissi` (any page works)
  pins that representative;
- otherwise a returning visitor keeps the representative they already have;
- otherwise one is chosen at random.

The choice lasts 30 days in a first-party cookie, `jh_rep`, that holds only the
handle. To add a representative, add their handle to `REP_HANDLES` and to
`REP_HANDLES` in `tests/rendered-html.test.mjs`. USANA serves the same page for
any handle, so confirm the address shows the right person first.

## License and brand

The repository is licensed under Apache-2.0. Modified files must be marked as
required by the license. The license does not grant rights to Joy Health brand
identifiers; see [TRADEMARKS.md](TRADEMARKS.md).
