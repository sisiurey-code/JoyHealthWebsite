# Joy Health

[joyhealth.cc](https://joyhealth.cc) is an evidence-aware collection of
source-traced nutrition guides.

The first release is intentionally static: no accounts, forms, database, or
customer health data. Content and code remain reviewable in Git, and the site
deploys directly to Cloudflare Workers.

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

## Publishing principles

- Cite and characterize health evidence accurately.
- Never imply medical credentials or individualized medical advice.
- Put material product-link disclosures beside the recommendation.
- Prefer useful original synthesis over search-targeted content volume.
- Keep pages server-rendered, accessible, and lightweight by default.

The public editorial charter is published at
[joyhealth.cc/standards](https://joyhealth.cc/standards). Release verification
and Search Console monitoring are documented in
[docs/SEO_OPERATIONS.md](docs/SEO_OPERATIONS.md).

## License and brand

The repository is licensed under Apache-2.0. Modified files must be marked as
required by the license. The license does not grant rights to Joy Health brand
identifiers; see [TRADEMARKS.md](TRADEMARKS.md).
