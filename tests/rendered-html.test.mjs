import assert from "node:assert/strict";
import { auditSeo, sitemapEntries } from "../scripts/audit-seo.mjs";
import { markdownPath, pageToMarkdown } from "../scripts/build-agent-files.mjs";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

const env = {
  ASSETS: {
    fetch: async (request) => {
      const url = new URL(request.url);
      const relativePath = url.pathname.replace(/^\/+/, "");

      try {
        const body = await readFile(
          new URL(`../dist/client/${relativePath}`, import.meta.url),
        );
        const contentType = url.pathname.endsWith(".css")
          ? "text/css; charset=utf-8"
          : url.pathname.endsWith(".js")
            ? "text/javascript; charset=utf-8"
            : url.pathname.endsWith(".webp")
              ? "image/webp"
              : url.pathname.endsWith(".png")
                ? "image/png"
                : "application/octet-stream";

        return new Response(body, {
          headers: { "content-type": contentType },
        });
      } catch (error) {
        if (error?.code !== "ENOENT") {
          throw error;
        }
      }

      return new Response("Not found", { status: 404 });
    },
  },
};

const ctx = {
  waitUntil() { },
  passThroughOnException() { },
};

function render(path, origin = "https://joyhealth.cc") {
  return worker.fetch(
    new Request(new URL(path, origin), { headers: { accept: "text/html" } }),
    env,
    ctx,
  );
}

const GUIDE_PUBLICATIONS = [
  ["/nutrition/building-balanced-meals", "2026-08-28"],
  ["/nutrition/protein-and-fiber", "2026-08-28"],
  ["/nutrition/reading-food-labels", "2026-08-28"],
  ["/nutrition/carbohydrates-and-fats", "2026-08-28"],
  ["/nutrition/hydration", "2026-08-28"],
  ["/nutrition/supplement-evidence-and-safety", "2026-08-28"],
  ["/nutrition/electrolyte-drinks", "2026-08-29"],
  ["/nutrition/creatine", "2026-09-24"],
];

const SUPPLEMENT_PAGES = [
  "/supplements/cellsentials",
  "/supplements/healthpak",
  "/supplements/procosa",
  "/supplements/biomega",
  "/supplements/magnecal-d",
  "/supplements/coquinone-30",
  "/supplements/clear-protein-creatine",
  "/supplements/core-aminos",
];

const INDEXABLE_PUBLIC_PATHS = [
  "/",
  "/standards",
  "/usana",
  "/nutrition",
  ...GUIDE_PUBLICATIONS.map(([path]) => path),
  ...SUPPLEMENT_PAGES,
];

const USANA_IMAGES = [
  ["cellsentials-product", 1204, false],
  ["cellsentials-label", 2088, true],
  ["healthpak-product", 1206, false],
  ["healthpak-label", 1392, true],
  ["procosa-product", 1102, false],
  ["procosa-label", 1000, true],
  ["biomega-product", 1000, false],
  ["biomega-label", 1000, true],
  ["magnecal-d-product", 1072, false],
  ["magnecal-d-label", 493, true],
  ["coquinone-product", 1042, false],
  ["coquinone-label", 498, true],
  ["clear-protein-creatine-product", 734, false],
  ["clear-protein-creatine-label", 488, true],
  ["core-aminos-product", 850, false],
  ["core-aminos-label", 850, true],
];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseSitemap(xml) {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/gi)].map(([, entry]) => {
    const location = entry.match(/<loc>([^<]+)<\/loc>/i)?.[1];
    const lastModified = entry.match(/<lastmod>([^<]+)<\/lastmod>/i)?.[1];

    assert.ok(location, `expected <loc> in sitemap entry: ${entry}`);
    return { location, lastModified };
  });
}

test("server-renders an indexable, self-canonical home page", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-robots-tag"), null);

  const html = await response.text();
  assert.match(html, /<html[^>]+lang="en"/i);
  assert.match(
    html,
    /<title>Healthy living, made clearer \| Joy Health<\/title>/i,
  );
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/joyhealth\.cc\/?"/i,
  );
  assert.match(
    html,
    /<meta property="og:image" content="https:\/\/joyhealth\.cc\/og\.jpg"/i,
  );
  assert.match(
    html,
    /<link rel="icon" href="\/favicon\.svg" type="image\/svg\+xml"/i,
  );
  assert.match(
    html,
    /<link rel="preload" href="\/fonts\/fraunces-variable\.woff2" as="font" type="font\/woff2" crossorigin="anonymous"/i,
  );
  assert.doesNotMatch(html, /bodoni-moda-latin-variable\.woff2/i);
  assert.match(
    html,
    /<h1[^>]*>Healthy living, made clearer\.<\/h1>/i,
  );
  assert.match(
    html,
    /href="\/nutrition#guides-title"[^>]*>Browse the guides/i,
  );
  assert.match(
    html,
    /href="\/usana"[^>]*>Supplements<\/a>/i,
  );
  assert.match(
    html,
    /<div class="site-store">[\s\S]*?<a(?=[^>]*href="https:\/\/sissi\.usana\.com\/")(?=[^>]*rel="sponsored")(?=[^>]*aria-describedby="header-store-disclosure")[^>]*>\s*Shop USANA[\s\S]*?id="header-store-disclosure"[^>]*>\s*Affiliate link: we may earn a commission\./i,
  );
  assert.match(
    html,
    /<div class="hero-actions">\s*<a(?=[^>]*class="primary-link")(?=[^>]*href="https:\/\/sissi\.usana\.com\/")(?=[^>]*rel="sponsored")(?=[^>]*aria-describedby="hero-store-disclosure")[^>]*>\s*Shop USANA/i,
  );
  assert.match(html, /<span aria-hidden="true">02<\/span>\s*Start with a question/i);
  assert.match(html, /<h2[^>]*>Good places to start\.<\/h2>/i);
  assert.doesNotMatch(html, /Curious, cheerful|Trust is part of the product/i);
  assert.doesNotMatch(html, /evidence-aware|show their work|limits attached/i);
  assert.match(html, /href="\/nutrition\/building-balanced-meals"/i);
  assert.match(html, /href="\/nutrition\/reading-food-labels"/i);
  assert.match(html, /href="\/nutrition\/supplement-evidence-and-safety"/i);
  assert.match(
    html,
    /<nav class="home-guides-more" aria-label="More nutrition guides">[\s\S]*?href="\/nutrition\/hydration"[\s\S]*?<\/nav>/i,
    "every non-featured guide is linked from the home page",
  );
  assert.match(html, /href="\/nutrition\/electrolyte-drinks"/i);
  assert.doesNotMatch(html, /class="guide-index"/i);
  assert.match(html, /<span aria-hidden="true">03<\/span>\s*Supplements, compared/i);
  assert.match(html, /A few supplements, looked at closely\./i);
  assert.match(html, /href="\/usana#products"[^>]*>Compare the products/i);
  assert.match(html, /href="\/usana#quality"[^>]*>See the quality evidence/i);
  assert.match(html, /class="product-shelf-grid"/i);
  assert.match(html, /\/images\/responsive\/usana\/cellsentials-product-320\.webp 320w/i);
  assert.match(html, /\/images\/responsive\/usana\/coquinone-product-320\.webp 320w/i);
  assert.equal(
    html.match(/<a[^>]*href="https:\/\/sissi\.usana\.com\/"/gi)?.length,
    3,
    "expected direct storefront links in the header, hero, and product section",
  );
  assert.match(
    html,
    /Supplements, compared[\s\S]*class="product-feature-catalog"[\s\S]*Affiliate disclosure:[\s\S]*these are USANA[\s\S]*href="https:\/\/sissi\.usana\.com\/"[^>]*rel="sponsored"/i,
  );
  assert.match(html, /See current products and prices/i);
  assert.match(html, /<span aria-hidden="true">04<\/span>\s*How we work/i);
  assert.doesNotMatch(html, /—/);
  assert.match(html, /general education, not medical advice/i);
  assert.doesNotMatch(html, /react-loading-skeleton/i);

  const jsonLdMatch = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/i,
  );
  assert.ok(jsonLdMatch, "expected WebSite JSON-LD");
  const jsonLd = JSON.parse(jsonLdMatch[1]);
  assert.equal(jsonLd["@type"], "WebSite");
  assert.equal(jsonLd.name, "Joy Health");
  assert.equal(jsonLd.alternateName, "joyhealth.cc");
  assert.equal(jsonLd.url, "https://joyhealth.cc/");

  const jsonLdItems = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi,
    ),
  ].map((match) => JSON.parse(match[1]));
  const organization = jsonLdItems.find(
    (item) => item["@type"] === "Organization",
  );
  assert.ok(organization, "expected Organization JSON-LD");
  assert.equal(organization.name, "Joy Health");
  assert.equal(organization.url, "https://joyhealth.cc/");
  assert.equal(organization.logo.url, "https://joyhealth.cc/favicon.svg");
});

test("gives the standards page unique metadata", async () => {
  const response = await render("/standards");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /<title>Editorial and recommendation standards \| Joy Health<\/title>/i,
  );
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/joyhealth\.cc\/standards"/i,
  );
  assert.match(
    html,
    /<meta property="og:image" content="https:\/\/joyhealth\.cc\/og\.jpg"/i,
  );
  assert.match(html, /<meta property="og:type" content="website"/i);
  assert.match(html, /<meta property="og:site_name" content="Joy Health"/i);
  assert.match(html, /Where disclosures appear/i);
});

test("publishes a source-linked USANA testing, quality, and manufacturing page", async () => {
  const response = await render("/usana");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /<title>USANA supplements compared: labels, testing, limits \| Joy Health<\/title>/i,
  );
  assert.match(
    html,
    /<meta name="description" content="CellSentials, HealthPak, BiOmega, MagneCal D, CoQuinone, and more compared by Supplement Facts label, plus which USANA quality claims are independently verified\."/i,
  );
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/joyhealth\.cc\/usana"/i,
  );
  assert.match(
    html,
    /<meta property="og:url" content="https:\/\/joyhealth\.cc\/usana"/i,
  );
  assert.match(
    html,
    /<h1[^>]*>\s*USANA supplements, compared label by label\.\s*<\/h1>/i,
  );
  assert.match(html, /<p class="eyebrow">Supplement guide<\/p>/i);
  assert.match(html, /href="#products"[^>]*>Compare the products/i);
  assert.match(
    html,
    /<div class="usana-hero-actions">\s*<a(?=[^>]*class="usana-products-link")(?=[^>]*href="https:\/\/sissi\.usana\.com\/")(?=[^>]*rel="sponsored")[^>]*>\s*Shop USANA/i,
  );
  assert.match(html, /The products on this page are made by USANA\. Storefront links[\s\S]*affiliate links/i);
  assert.match(html, /class="product-shelf-grid"/i);
  assert.match(html, /A few of the products reviewed below\./i);
  assert.doesNotMatch(html, /usana-word-display/i);
  assert.match(
    html,
    /Compare CellSentials, HealthPak, and six focused formulas[\s\S]*before you choose/i,
  );
  assert.match(html, /<h2[^>]*>Is USANA third-party tested\?<\/h2>/i);
  assert.match(html, /individual product evidence, rather than a brand-wide conclusion/i);
  assert.match(
    html,
    /<h3><span class="usana-title-lock">Core Aminos<\/span><\/h3>/i,
  );
  assert.match(html, /aria-current="page"[^>]*>Supplements<\/a>/i);
  assert.match(html, /67%[\s\S]*manufacturing, production, and quality control/i);
  assert.match(html, /<dt>11<\/dt>[\s\S]*NSF\/ANSI 173 official listing/i);
  assert.doesNotMatch(html, /names 12 finished products|identifies 12 USANA/i);
  assert.match(
    html,
    /href="https:\/\/standards\.nsf\.org\/discussion\/nsfansi-173-2025-dietary-supplements-uploaded"[^>]*>[\s\S]*NSF\/ANSI 173/i,
  );
  assert.match(html, /\$10\.7M[\s\S]*research and development in 2025/i);
  assert.match(html, /CellSentials was reformulated in 2025\./i);
  assert.match(html, /<h2[^>]*>Each USANA product, with its Supplement Facts label\.<\/h2>/i);

  const usanaJsonLd = [
    ...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi),
  ].map((match) => JSON.parse(match[1]));
  const productList = usanaJsonLd.find((item) => item["@type"] === "ItemList");
  assert.ok(productList, "expected Product ItemList JSON-LD");
  assert.equal(productList.numberOfItems, 8);
  assert.equal(productList.itemListElement[0].item["@type"], "Product");
  assert.equal(productList.itemListElement[0].item.name, "CellSentials");
  assert.equal(productList.itemListElement[0].item.brand.name, "USANA Health Sciences");
  assert.match(productList.itemListElement[0].item.image, /^https:\/\/joyhealth\.cc\/images\/usana\//);
  for (const entry of productList.itemListElement) {
    assert.equal(entry.item.offers, undefined, "no prices are stated on the page");
    assert.equal(entry.item.aggregateRating, undefined, "no ratings are stated on the page");
  }
  assert.match(html, /class="usana-products-criteria-label">Product selection criteria/i);
  assert.match(html, /Flagship foundation[\s\S]*CellSentials/i);
  assert.match(html, /Flagship convenience[\s\S]*HealthPak/i);
  assert.match(
    html,
    /Procosa[\s\S]*BiOmega[\s\S]*MagneCal D[\s\S]*CoQuinone[\s\S]*Clear Protein[\s\S]*\+ Creatine[\s\S]*Core Aminos/i,
  );
  assert.match(
    html,
    /class="usana-title-lock">Clear Protein<\/span> \+ Creatine/i,
  );
  assert.doesNotMatch(html, /Otherwise, the combination may add cost/i);
  assert.match(html, /Showing the overview for CellSentials\. Show the Supplement Facts label\./i);
  assert.match(html, /Showing the overview for HealthPak\. Show the Supplement Facts label\./i);
  assert.equal(
    html.match(/Showing the overview for [^<"]+\. Show the Supplement Facts label\./gi)?.length,
    8,
    "expected eight two-state product cards",
  );
  assert.equal(
    html.match(/class="usana-product-face usana-product-overview is-active"/gi)?.length,
    8,
    "expected every card to show its product photo by default",
  );
  for (const image of [
    "cellsentials",
    "healthpak",
    "procosa",
    "biomega",
    "magnecal-d",
    "coquinone",
    "clear-protein-creatine",
    "core-aminos",
  ]) {
    assert.match(html, new RegExp(`/images/usana/${image}-product\\.png`, "i"));
    assert.match(html, new RegExp(`/images/usana/${image}-label\\.png`, "i"));
  }
  assert.match(html, /Clear Protein \+ Creatine Mix/i);
  assert.match(html, /Clear Protein Drink is ready-to-drink clear whey\./i);
  assert.match(html, /Each piña colada can contains 22 grams of clear whey protein/i);
  assert.match(html, /https:\/\/www\.buynutritionals\.com\/usana-clear-protein-drink/i);
  assert.doesNotMatch(html, /Protein Pop|Rise Wellness/i);
  assert.match(
    html,
    /In-house control can[\s\S]*make accountability for production and corrective action more[\s\S]*direct/i,
  );
  assert.doesNotMatch(html, /useful operational signal/i);
  assert.match(
    html,
    /The announcement confirms a new version of CellSentials\.[\s\S]*does not prove[\s\S]*improves health outcomes/i,
  );
  assert.match(html, /Quality is not the same question as efficacy\./i);
  assert.match(html, /does not approve dietary supplements before marketing/i);
  assert.match(html, /aria-label="Three supplement verification checks"/i);
  assert.match(
    html,
    /<details>[\s\S]*<summary>Verify the exact product and current label\.<\/summary>[\s\S]*Check again in hand/i,
  );
  assert.match(
    html,
    /Match the ingredient, form, amount, and intended use to the evidence\.[\s\S]*Use the supplement evidence guide/i,
  );
  assert.match(
    html,
    /Keep personal safety and medication questions separate from brand quality\.[\s\S]*Prepare one complete list/i,
  );
  assert.match(html, /Updated[\s\S]*August 31, 2026/i);
  assert.match(html, /https:\/\/ir\.usana\.com\/company-information/i);
  assert.match(html, /https:\/\/info\.nsf\.org\/Certified\/Dietary\/Listings\.asp/i);
  assert.match(html, /https:\/\/ir\.usana\.com\/sustainability/i);
  assert.match(html, /usana-expands-its-nutritionals-line-with-powerful-new/i);
  assert.match(html, /https:\/\/www\.fda\.gov\/food\/information-consumers-using-dietary-supplements\/questions-and-answers-dietary-supplements/i);
  assert.match(html, /<aside[^>]*class="usana-catalog-dock"[^>]*id="catalog"/i);
  assert.doesNotMatch(html, /usana-catalog-dock is-open/i);
  assert.match(html, /aria-expanded="false"[^>]*aria-label="Expand the storefront panel"/i);
  assert.doesNotMatch(html, /aria-controls="usana-catalog-panel"/i);
  assert.match(html, /Prices and current formulas/i);
  assert.doesNotMatch(html, /The useful urgency/i);
  assert.match(
    html,
    /Friendly nutrition guides that show where the facts come from\./i,
  );
  assert.equal(
    html.match(/<a[^>]*href="https:\/\/sissi\.usana\.com\/"/gi)?.length,
    4,
    "expected four clearly disclosed storefront links on the USANA page",
  );
  assert.equal(
    html.match(/<a[^>]*href="https:\/\/sissi\.usana\.com\/"[^>]*rel="sponsored"/gi)?.length,
    4,
    "expected every storefront link to carry rel=sponsored",
  );
  assert.match(
    html,
    /Affiliate disclosure:[\s\S]*Joy Health may earn a[\s\S]*href="https:\/\/sissi\.usana\.com\/"[^>]*rel="sponsored"/i,
  );
  assert.doesNotMatch(html, /FDA-approved facility/i);
  assert.doesNotMatch(html, /—/);
});

test("publishes a nutrition hub with only complete guides linked", async () => {
  const response = await render("/nutrition");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /<title>Nutrition guides: meals, labels, and supplements \| Joy Health<\/title>/i,
  );
  assert.match(
    html,
    /<meta name="description" content="Accessible guides to meals, food labels, protein and fiber, carbohydrates and fats, hydration, electrolyte drinks, and supplements\. Sources included\."/i,
  );
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/joyhealth\.cc\/nutrition"/i,
  );
  assert.match(
    html,
    /<meta property="og:url" content="https:\/\/joyhealth\.cc\/nutrition"/i,
  );
  assert.match(
    html,
    /<h1[^>]*>Practical nutrition guides for everyday questions\.<\/h1>/i,
  );
  const nutritionJsonLd = [
    ...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi),
  ].map((match) => JSON.parse(match[1]));
  const guideList = nutritionJsonLd.find((item) => item["@type"] === "ItemList");
  assert.ok(guideList, "expected guide ItemList JSON-LD");
  assert.equal(guideList.numberOfItems, GUIDE_PUBLICATIONS.length);
  assert.equal(guideList.itemListElement[0].url, "https://joyhealth.cc/nutrition/building-balanced-meals");
  assert.equal(guideList.itemListElement[6].url, "https://joyhealth.cc/nutrition/electrolyte-drinks");
  assert.equal(guideList.itemListElement[7].url, "https://joyhealth.cc/nutrition/creatine");
  assert.match(html, /The guides, in a sensible order\./i);
  assert.match(html, /href="\/nutrition\/building-balanced-meals"/i);
  assert.match(html, /href="\/nutrition\/protein-and-fiber"/i);
  assert.match(html, /href="\/nutrition\/reading-food-labels"/i);
  assert.match(html, /href="\/nutrition\/carbohydrates-and-fats"/i);
  assert.match(html, /href="\/nutrition\/hydration"/i);
  assert.match(html, /href="\/nutrition\/supplement-evidence-and-safety"/i);
  assert.match(html, /href="\/nutrition\/electrolyte-drinks"/i);
  assert.match(html, /href="\/nutrition\/creatine"/i);
  assert.doesNotMatch(html, /coming soon|placeholder/i);
  assert.doesNotMatch(html, /—/);
});

test("serves responsive USANA display images while linking original labels", async () => {
  const response = await render("/usana");
  const html = await response.text();
  const cardSizes =
    "(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 400px";
  const featuredSizes = "(max-width: 760px) 100vw, 480px";

  assert.equal(response.status, 200);
  assert.doesNotMatch(html, /\/_next\/image/i);

  for (const [basename, intrinsicWidth, isLabel] of USANA_IMAGES) {
    const originalPath = `/images/usana/${basename}.png`;
    const expectedSizes = /^(?:cellsentials|healthpak)-/.test(basename)
      ? featuredSizes
      : cardSizes;

    assert.match(
      html,
      new RegExp(
        `<img[^>]+src="${escapeRegex(originalPath)}"[^>]+sizes="${escapeRegex(expectedSizes)}"`,
        "i",
      ),
    );

    const expectedWidths = [...new Set([
      ...[320, 640, 960].filter((candidate) => candidate <= intrinsicWidth),
      intrinsicWidth,
    ])];

    for (const width of expectedWidths) {
      const candidatePath = `/images/responsive/usana/${basename}-${width}.webp`;
      assert.match(
        html,
        new RegExp(`${escapeRegex(candidatePath)} ${width}w`, "i"),
      );

      const candidateResponse = await worker.fetch(
        new Request(`https://joyhealth.cc${candidatePath}`, {
          headers: { accept: "image/webp" },
        }),
        env,
        ctx,
      );
      assert.equal(candidateResponse.status, 200, candidatePath);
      assert.equal(candidateResponse.headers.get("content-type"), "image/webp");
    }

    if (isLabel) {
      assert.match(
        html,
        new RegExp(`<a[^>]+href="${escapeRegex(originalPath)}"`, "i"),
      );
      const originalResponse = await worker.fetch(
        new Request(`https://joyhealth.cc${originalPath}`, {
          headers: { accept: "image/png" },
        }),
        env,
        ctx,
      );
      assert.equal(originalResponse.status, 200, originalPath);
      assert.equal(originalResponse.headers.get("content-type"), "image/png");
    }
  }
});

test("publishes a source-traced protein-and-fiber guide with separate reference systems", async () => {
  const response = await render("/nutrition/protein-and-fiber");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /<title>Protein and fiber: sources and recommended amounts \| Joy Health<\/title>/i,
  );
  assert.match(
    html,
    /<meta name="description" content="Which foods contribute protein, fiber, or both, how each appears on a Nutrition Facts label, and what the RDA, Adequate Intake, and Daily Value numbers mean\."/i,
  );
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/joyhealth\.cc\/nutrition\/protein-and-fiber"/i,
  );
  assert.match(
    html,
    /<meta property="og:url" content="https:\/\/joyhealth\.cc\/nutrition\/protein-and-fiber"/i,
  );
  assert.doesNotMatch(html, /(?:property="og:image"|name="twitter:image")/i);
  assert.match(
    html,
    /<h1[^>]*>Protein and fiber: sources and recommended amounts<\/h1>/i,
  );
  assert.match(html, /Prepared by[\s\S]*Joy Health/i);
  assert.match(html, /Published August 28, 2026/i);
  assert.match(html, /Which foods contribute protein, fiber, or both\?/i);
  assert.match(html, /How much protein and fiber is recommended\? RDA, AI, and Daily Value/i);
  assert.match(html, /How to use protein and fiber numbers on food labels/i);
  assert.match(html, /What these protein and fiber numbers do not tell you/i);
  assert.match(html, /Sources we read/i);
  assert.match(html, /Medical information notice/i);
  assert.match(html, /0\.8 grams per kilogram/i);
  assert.match(html, /1\.2 to 1\.6 grams per kilogram/i);
  assert.match(html, /50 grams for nutrition labeling/i);
  assert.match(html, /14 grams per 1,000 kilocalories/i);
  assert.match(html, /28 grams for nutrition labeling/i);
  assert.match(html, /RDA, an AI, an FDA Daily Value, or[\s\S]*federal policy goal/i);
  assert.match(html, /href="\/nutrition\/reading-food-labels"/i);
  assert.match(
    html,
    /https:\/\/nap\.nationalacademies\.org\/catalog\/11537\/dietary-reference-intakes-the-essential-guide-to-nutrient-requirements/i,
  );
  assert.match(
    html,
    /https:\/\/www\.fda\.gov\/food\/nutrition-facts-label\/daily-value-nutrition-and-supplement-facts-labels/i,
  );
  assert.match(
    html,
    /https:\/\/www\.fda\.gov\/food\/nutrition-food-labeling-and-critical-foods\/questions-and-answers-dietary-fiber/i,
  );
  assert.match(html, /https:\/\/cdn\.realfood\.gov\/DGA\.pdf/i);
  assert.doesNotMatch(html, /—/);

  const jsonLdMatch = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/i,
  );
  assert.ok(jsonLdMatch, "expected Article JSON-LD");
  const jsonLd = JSON.parse(jsonLdMatch[1]);
  assert.equal(jsonLd["@type"], "Article");
  assert.equal(
    jsonLd.headline,
    "Protein and fiber: sources and recommended amounts",
  );
  assert.equal(
    jsonLd.mainEntityOfPage,
    "https://joyhealth.cc/nutrition/protein-and-fiber",
  );
  assert.equal(jsonLd.datePublished, "2026-08-28");
  assert.equal(jsonLd.dateModified, undefined);
  assert.equal(jsonLd.image, undefined);
});

test("publishes a source-traced balanced-meals guide with matching Article data", async () => {
  const response = await render("/nutrition/building-balanced-meals");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /<title>How to build a balanced meal without rigid rules \| Joy Health<\/title>/i,
  );
  assert.match(
    html,
    /<meta name="description" content="A flexible framework for building everyday meals from familiar foods, with room for culture, budget, access, appetite, and preference\."/i,
  );
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/joyhealth\.cc\/nutrition\/building-balanced-meals"/i,
  );
  assert.match(
    html,
    /<meta property="og:url" content="https:\/\/joyhealth\.cc\/nutrition\/building-balanced-meals"/i,
  );
  assert.doesNotMatch(html, /(?:property="og:image"|name="twitter:image")/i);
  assert.match(
    html,
    /<h1[^>]*>How to build a balanced meal without rigid rules<\/h1>/i,
  );
  assert.match(html, /Prepared by[\s\S]*Joy Health/i);
  assert.match(html, /Published August 28, 2026/i);
  assert.match(html, /What makes a balanced meal\?/i);
  assert.match(html, /What the Dietary Guidelines and evidence can tell us/i);
  assert.match(html, /How to build a balanced meal in four steps/i);
  assert.match(html, /What this meal framework does not do/i);
  assert.match(html, /Sources we read/i);
  assert.match(html, /Medical information notice/i);
  assert.match(html, /Mixed dishes count/i);
  assert.match(html, /not personalized portions/i);
  assert.match(html, /current policy,[\s\S]*earlier advisory scientific report/i);
  assert.match(html, /https:\/\/cdn\.realfood\.gov\/DGA\.pdf/i);
  assert.match(
    html,
    /https:\/\/www\.dietaryguidelines\.gov\/sites\/default\/files\/2024-12\/Part%20D_Ch%202_Dietary%20Patterns_FINAL_508\.pdf/i,
  );
  assert.match(
    html,
    /https:\/\/www\.dietaryguidelines\.gov\/2025-advisory-committee-report\/food-pattern-modeling/i,
  );
  assert.doesNotMatch(html, /—/);

  const jsonLdMatch = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/i,
  );
  assert.ok(jsonLdMatch, "expected Article JSON-LD");
  const jsonLd = JSON.parse(jsonLdMatch[1]);
  assert.equal(jsonLd["@type"], "Article");
  assert.equal(
    jsonLd.headline,
    "How to build a balanced meal without rigid rules",
  );
  assert.equal(
    jsonLd.mainEntityOfPage,
    "https://joyhealth.cc/nutrition/building-balanced-meals",
  );
  assert.equal(jsonLd.datePublished, "2026-08-28");
  assert.equal(jsonLd.dateModified, undefined);
  assert.equal(jsonLd.image, undefined);
});

test("publishes a source-traced food-label guide with matching Article data", async () => {
  const response = await render("/nutrition/reading-food-labels");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /<title>How to read a Nutrition Facts label \| Joy Health<\/title>/i,
  );
  assert.match(
    html,
    /<meta name="description" content="Learn how to read a U\.S\. Nutrition Facts label: serving size, the 5% and 20% Daily Value rule, added sugars, ingredients, and allergens\."/i,
  );
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/joyhealth\.cc\/nutrition\/reading-food-labels"/i,
  );
  assert.match(
    html,
    /<meta property="og:url" content="https:\/\/joyhealth\.cc\/nutrition\/reading-food-labels"/i,
  );
  assert.match(
    html,
    /<meta property="og:title" content="How to read a Nutrition Facts label \| Joy Health"/i,
  );
  assert.match(
    html,
    /<meta name="twitter:title" content="How to read a Nutrition Facts label \| Joy Health"/i,
  );
  assert.doesNotMatch(html, /(?:property="og:image"|name="twitter:image")/i);
  assert.match(
    html,
    /<h1[^>]*>How to read a Nutrition Facts label<\/h1>/i,
  );
  assert.match(html, /Prepared by[\s\S]*Joy Health/i);
  assert.match(html, /Published August 28, 2026/i);
  assert.match(html, /Start with serving size, then use the 5% and 20% Daily Value rule/i);
  assert.match(html, /What each part of the Nutrition Facts label means/i);
  assert.match(html, /How to read a Nutrition Facts label in five steps/i);
  assert.match(html, /What a Nutrition Facts label cannot tell you/i);
  assert.match(html, /Sources we read/i);
  assert.match(html, /Medical information notice/i);
  assert.match(html, /separate per-package column/i);
  assert.match(html, /single-ingredient sugars and syrups/i);
  assert.match(html, /grams, milligrams, or micrograms/i);
  assert.doesNotMatch(html, /Every calorie and nutrient number/i);
  assert.match(html, /href="\/standards"/i);
  assert.match(
    html,
    /https:\/\/www\.fda\.gov\/food\/nutrition-facts-label\/how-understand-and-use-nutrition-facts-label/i,
  );
  assert.match(
    html,
    /https:\/\/www\.fda\.gov\/food\/food-additives-and-gras-ingredients-information-consumers\/types-food-ingredients/i,
  );
  assert.match(
    html,
    /https:\/\/www\.fda\.gov\/consumers\/consumer-updates\/have-food-allergies-read-label/i,
  );
  assert.doesNotMatch(html, /—/);

  const jsonLdMatch = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/i,
  );
  assert.ok(jsonLdMatch, "expected Article JSON-LD");
  const jsonLd = JSON.parse(jsonLdMatch[1]);
  assert.equal(jsonLd["@type"], "Article");
  assert.equal(jsonLd.headline, "How to read a Nutrition Facts label");
  assert.equal(
    jsonLd.mainEntityOfPage,
    "https://joyhealth.cc/nutrition/reading-food-labels",
  );
  assert.equal(jsonLd.datePublished, "2026-08-28");
  assert.deepEqual(jsonLd.author, {
    "@type": "Organization",
    "@id": "https://joyhealth.cc/#organization",
    name: "Joy Health",
    url: "https://joyhealth.cc/",
  });
  assert.equal(jsonLd.dateModified, undefined);
  assert.equal(jsonLd.image, undefined);
});

test("publishes a source-traced carbohydrate-and-fat guide with replacement context", async () => {
  const response = await render("/nutrition/carbohydrates-and-fats");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /<title>Carbohydrates and fats: what the label terms mean \| Joy Health<\/title>/i);
  assert.match(html, /<link rel="canonical" href="https:\/\/joyhealth\.cc\/nutrition\/carbohydrates-and-fats"/i);
  assert.match(html, /<meta property="og:url" content="https:\/\/joyhealth\.cc\/nutrition\/carbohydrates-and-fats"/i);
  assert.doesNotMatch(html, /(?:property="og:image"|name="twitter:image")/i);
  assert.match(html, /Published August 28, 2026/i);
  assert.match(html, /What do carbohydrate and fat mean on a Nutrition Facts label\?/i);
  assert.match(html, /Types of carbohydrates and fats, and where they come from/i);
  assert.match(html, /How to compare carbohydrates and fats in real foods/i);
  assert.match(html, /What this guide does not decide about carbohydrates and fats/i);
  assert.match(html, /The replacement is part of the recommendation/i);
  assert.match(html, /https:\/\/www\.who\.int\/publications\/i\/item\/9789240073630/i);
  assert.match(html, /https:\/\/cdn\.realfood\.gov\/DGA\.pdf/i);
  assert.doesNotMatch(html, /—/);

  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  assert.ok(jsonLdMatch, "expected Article JSON-LD");
  const jsonLd = JSON.parse(jsonLdMatch[1]);
  assert.equal(jsonLd["@type"], "Article");
  assert.equal(jsonLd.headline, "Carbohydrates and fats: what the label terms mean");
  assert.equal(jsonLd.mainEntityOfPage, "https://joyhealth.cc/nutrition/carbohydrates-and-fats");
  assert.equal(jsonLd.datePublished, "2026-08-28");
  assert.equal(jsonLd.dateModified, undefined);
  assert.equal(jsonLd.image, undefined);
});

test("publishes a source-traced hydration guide that distinguishes total water", async () => {
  const response = await render("/nutrition/hydration");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /<title>How much water should you drink each day\? \| Joy Health<\/title>/i);
  assert.match(html, /<link rel="canonical" href="https:\/\/joyhealth\.cc\/nutrition\/hydration"/i);
  assert.match(html, /<meta property="og:url" content="https:\/\/joyhealth\.cc\/nutrition\/hydration"/i);
  assert.doesNotMatch(html, /(?:property="og:image"|name="twitter:image")/i);
  assert.match(html, /Published August 28, 2026/i);
  assert.match(html, /How much water should you drink\? First define total water/i);
  assert.match(html, /How much water per day do the reference values say\?/i);
  assert.match(html, /How to use the daily water reference values/i);
  assert.match(html, /When the daily water numbers do not apply/i);
  assert.match(html, /<p class="guide-dek">The adult reference values are 3\.7 liters of total water per day for men and 2\.7 liters for women/i);
  assert.match(html, /3\.7 liters per day for men and 2\.7 liters per day for women/i);
  assert.match(html, /not exact requirements or plain-water prescriptions/i);
  assert.match(html, /href="\/nutrition\/electrolyte-drinks"[^>]*>electrolytes versus water<\/a>/i);
  assert.match(html, /https:\/\/www\.nationalacademies\.org\/read\/10925\/chapter\/6/i);
  assert.match(html, /https:\/\/www\.cdc\.gov\/healthy-weight-growth\/water-healthy-drinks\/index\.html/i);
  assert.doesNotMatch(html, /—/);

  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  assert.ok(jsonLdMatch, "expected Article JSON-LD");
  const jsonLd = JSON.parse(jsonLdMatch[1]);
  assert.equal(jsonLd["@type"], "Article");
  assert.equal(jsonLd.headline, "How much water should you drink each day?");
  assert.equal(jsonLd.mainEntityOfPage, "https://joyhealth.cc/nutrition/hydration");
  assert.equal(jsonLd.datePublished, "2026-08-28");
  assert.equal(jsonLd.dateModified, undefined);
  assert.equal(jsonLd.image, undefined);
});

test("publishes a source-traced supplement guide with separate evidence roles", async () => {
  const response = await render("/nutrition/supplement-evidence-and-safety");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /<title>Are supplements FDA approved\? Evidence and safety \| Joy Health<\/title>/i);
  assert.match(html, /<link rel="canonical" href="https:\/\/joyhealth\.cc\/nutrition\/supplement-evidence-and-safety"/i);
  assert.match(html, /<meta property="og:url" content="https:\/\/joyhealth\.cc\/nutrition\/supplement-evidence-and-safety"/i);
  assert.doesNotMatch(html, /(?:property="og:image"|name="twitter:image")/i);
  assert.match(html, /Published August 28, 2026/i);
  assert.match(html, /Are dietary supplements FDA approved before they are sold\?/i);
  assert.match(html, /What a Supplement Facts label, a quality seal, and a study can each tell you/i);
  assert.match(html, /How to check a supplement&#x27;s evidence and safety in six steps/i);
  assert.match(html, /What this supplement checklist does not do/i);
  assert.match(html, /<p class="guide-dek">In the United States, FDA does not approve dietary supplements/i);
  assert.match(html, /does not approve dietary supplements[\s\S]*before they are sold/i);
  assert.match(html, /A quality seal is not proof/i);
  assert.match(html, /Absence from the database is not evidence of safety/i);
  assert.match(html, /https:\/\/www\.ftc\.gov\/business-guidance\/resources\/health-products-compliance-guidance/i);
  assert.match(html, /https:\/\/ods\.od\.nih\.gov\/HealthInformation\/ODS_Frequently_Asked_Questions\//i);
  assert.doesNotMatch(
    html.match(/<main\b[^>]*>[\s\S]*?<\/main>/i)?.[0] ?? html,
    /sissi\.usana\.com/i,
    "the editorial guide body remains free of affiliate links",
  );
  assert.doesNotMatch(html, /—/);

  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  assert.ok(jsonLdMatch, "expected Article JSON-LD");
  const jsonLd = JSON.parse(jsonLdMatch[1]);
  assert.equal(jsonLd["@type"], "Article");
  assert.equal(jsonLd.headline, "Are supplements FDA approved? Evidence and safety");
  assert.equal(jsonLd.mainEntityOfPage, "https://joyhealth.cc/nutrition/supplement-evidence-and-safety");
  assert.equal(jsonLd.datePublished, "2026-08-28");
  assert.equal(jsonLd.dateModified, undefined);
  assert.equal(jsonLd.image, undefined);
});

test("publishes a source-traced electrolyte guide that separates the label from the use case", async () => {
  const response = await render("/nutrition/electrolyte-drinks");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /<title>Electrolytes vs\. water: when do you need them\? \| Joy Health<\/title>/i);
  assert.match(html, /<link rel="canonical" href="https:\/\/joyhealth\.cc\/nutrition\/electrolyte-drinks"/i);
  assert.match(html, /<meta property="og:url" content="https:\/\/joyhealth\.cc\/nutrition\/electrolyte-drinks"/i);
  assert.doesNotMatch(html, /(?:property="og:image"|name="twitter:image")/i);
  assert.match(html, /Published August 29, 2026/i);
  assert.match(html, /Electrolytes vs\. water: the context decides/i);
  assert.match(html, /What to compare on an electrolyte drink label/i);
  assert.match(html, /How to decide between water and an electrolyte drink/i);
  assert.match(html, /When electrolyte guidance needs more context than this guide/i);
  assert.match(html, /Contains electrolytes[\s\S]*names ingredients, not a need/i);
  assert.match(html, /universal replacement instructions impossible/i);
  assert.match(html, /href="\/nutrition\/hydration"[^>]*>how much water[\s\S]*counts as total water<\/a>/i);
  assert.match(html, /https:\/\/www\.nata\.org\/sites\/default\/files\/2025-08\/fluid_replacement_for_the_physically_active\.pdf/i);
  assert.match(html, /https:\/\/ods\.od\.nih\.gov\/factsheets\/Potassium-HealthProfessional\//i);
  assert.match(html, /https:\/\/www\.fda\.gov\/food\/nutrition-facts-label\/how-understand-and-use-nutrition-facts-label/i);
  assert.doesNotMatch(
    html.match(/<main\b[^>]*>[\s\S]*?<\/main>/i)?.[0] ?? html,
    /sissi\.usana\.com/i,
    "the editorial guide body remains free of affiliate links",
  );
  assert.doesNotMatch(html, /—/);

  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  assert.ok(jsonLdMatch, "expected Article JSON-LD");
  const jsonLd = JSON.parse(jsonLdMatch[1]);
  assert.equal(jsonLd["@type"], "Article");
  assert.equal(jsonLd.headline, "Electrolytes vs. water: when do you need them?");
  assert.equal(jsonLd.mainEntityOfPage, "https://joyhealth.cc/nutrition/electrolyte-drinks");
  assert.equal(jsonLd.datePublished, "2026-08-29");
  assert.equal(jsonLd.dateModified, undefined);
  assert.equal(jsonLd.image, undefined);
});

test("matches article breadcrumb data to the visible site hierarchy", async () => {
  const guides = [
    ["/nutrition/building-balanced-meals", "Building balanced meals"],
    ["/nutrition/carbohydrates-and-fats", "Carbohydrates and fats"],
    ["/nutrition/hydration", "Hydration"],
    ["/nutrition/electrolyte-drinks", "Electrolyte drinks"],
    ["/nutrition/protein-and-fiber", "Protein and fiber"],
    ["/nutrition/reading-food-labels", "Reading food labels"],
    [
      "/nutrition/supplement-evidence-and-safety",
      "Supplement evidence and safety",
    ],
  ];

  for (const [path, pageName] of guides) {
    const response = await render(path);
    assert.equal(response.status, 200);
    const html = await response.text();
    const jsonLdItems = [
      ...html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi,
      ),
    ].map((match) => JSON.parse(match[1]));
    const breadcrumb = jsonLdItems.find(
      (item) => item["@type"] === "BreadcrumbList",
    );

    assert.ok(breadcrumb, `expected BreadcrumbList JSON-LD for ${path}`);
    assert.match(
      html,
      new RegExp(`<li aria-current="page">${escapeRegex(pageName)}</li>`),
      `visible breadcrumb should match structured data for ${path}`,
    );
    assert.match(html, /<main id="main-content">/i);
    assert.deepEqual(
      breadcrumb.itemListElement.map(({ position, name, item }) => ({
        position,
        name,
        item,
      })),
      [
        { position: 1, name: "Home", item: "https://joyhealth.cc/" },
        {
          position: 2,
          name: "Nutrition",
          item: "https://joyhealth.cc/nutrition",
        },
        {
          position: 3,
          name: pageName,
          item: `https://joyhealth.cc${path}`,
        },
      ],
    );
  }
});

test("publishes the exact unique public URL inventory with truthful dates", async () => {
  const [robotsResponse, sitemapResponse] = await Promise.all([
    render("/robots.txt"),
    render("/sitemap.xml"),
  ]);

  assert.equal(robotsResponse.status, 200);
  assert.match(await robotsResponse.text(), /Sitemap: https:\/\/joyhealth\.cc\/sitemap\.xml/i);
  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  const entries = parseSitemap(sitemap);
  const locations = entries.map(({ location }) => location);
  const expectedLocations = INDEXABLE_PUBLIC_PATHS.map(
    (path) => `https://joyhealth.cc${path}`,
  );

  assert.equal(entries.length, INDEXABLE_PUBLIC_PATHS.length);
  assert.equal(new Set(locations).size, entries.length, "duplicate sitemap URL");
  assert.deepEqual(new Set(locations), new Set(expectedLocations));
  assert.doesNotMatch(sitemap, /priority|changefreq/i);

  const byLocation = new Map(
    entries.map(({ location, lastModified }) => [location, lastModified]),
  );
  assert.equal(byLocation.get("https://joyhealth.cc/usana"), "2026-09-24");
  assert.equal(byLocation.get("https://joyhealth.cc/nutrition"), "2026-09-24");
  for (const path of SUPPLEMENT_PAGES) {
    assert.equal(byLocation.get(`https://joyhealth.cc${path}`), "2026-09-24", path);
  }

  for (const [path, publishedDate] of GUIDE_PUBLICATIONS) {
    assert.equal(byLocation.get(`https://joyhealth.cc${path}`), publishedDate);
  }
});

test("keeps guide canonical and publication-date surfaces aligned", async () => {
  const sitemapResponse = await render("/sitemap.xml");
  const sitemapEntries = parseSitemap(await sitemapResponse.text());
  const sitemapDates = new Map(
    sitemapEntries.map(({ location, lastModified }) => [location, lastModified]),
  );

  for (const [path, publishedDate] of GUIDE_PUBLICATIONS) {
    const canonicalUrl = `https://joyhealth.cc${path}`;
    const response = await render(path);
    const html = await response.text();
    const jsonLdItems = [
      ...html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi,
      ),
    ].map((match) => JSON.parse(match[1]));
    const article = jsonLdItems.find((item) => item["@type"] === "Article");

    assert.equal(response.status, 200);
    assert.equal(article.articleSection, "Nutrition");
    assert.deepEqual(article.isPartOf, { "@id": "https://joyhealth.cc/#website" });
    assert.match(
      html,
      /<nav class="related-guides" aria-labelledby="related-guides-title">/i,
      `expected a Related guides block on ${path}`,
    );
    const relatedLinks = [
      ...html.matchAll(/<nav class="related-guides"[\s\S]*?<\/nav>/gi),
    ][0][0].match(/href="\/nutrition\/[a-z-]+"/g);
    assert.equal(relatedLinks.length, 3, `expected three related guides on ${path}`);
    assert.ok(!relatedLinks.includes(`href="${path}"`), `guide must not relate to itself: ${path}`);
    assert.match(html, /<meta name="robots" content="index, follow"/i);
    assert.match(html, /<meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1"/i);
    assert.match(
      html,
      new RegExp(
        `<link rel="canonical" href="${canonicalUrl.replaceAll("/", "\\/")}"`,
        "i",
      ),
    );
    assert.match(
      html,
      new RegExp(`<time datetime="${publishedDate}">`, "i"),
    );
    assert.match(
      html,
      new RegExp(
        `<meta property="article:published_time" content="${publishedDate}"`,
        "i",
      ),
    );
    assert.ok(article, `expected Article JSON-LD for ${path}`);
    assert.equal(article.mainEntityOfPage, canonicalUrl);
    assert.equal(article.datePublished, publishedDate);
    assert.deepEqual(article.author, {
      "@type": "Organization",
      "@id": "https://joyhealth.cc/#organization",
      name: "Joy Health",
      url: "https://joyhealth.cc/",
    });
    assert.deepEqual(article.publisher, {
      "@type": "Organization",
      "@id": "https://joyhealth.cc/#organization",
      name: "Joy Health",
      url: "https://joyhealth.cc/",
    });
    assert.equal(sitemapDates.get(canonicalUrl), publishedDate);
  }
});

test("keeps the USANA review date aligned with the sitemap", async () => {
  const [pageResponse, sitemapResponse] = await Promise.all([
    render("/usana"),
    render("/sitemap.xml"),
  ]);
  const html = await pageResponse.text();
  const usanaEntry = parseSitemap(await sitemapResponse.text()).find(
    ({ location }) => location === "https://joyhealth.cc/usana",
  );

  assert.equal(pageResponse.status, 200);
  assert.match(html, /Updated\s*<time datetime="2026-09-24">September 24, 2026<\/time>/i);
  assert.equal(usanaEntry?.lastModified, "2026-09-24");
});

test("prerenders every public route and the 404 with static artifacts", async () => {
  const distServer = fileURLToPath(new URL("../dist/server", import.meta.url));
  const manifestPath = path.join(distServer, "vinext-prerender.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  // Route handlers (feed, robots, label data) are served by the Worker at request time.
  const apiRoutes = manifest.routes.filter(({ reason }) => reason === "api");
  assert.deepEqual(
    new Set(apiRoutes.map(({ route }) => route)),
    new Set(["/feed.xml", "/robots.txt", "/data/supplement-labels.json", "/data/supplement-labels.csv"]),
  );
  manifest.routes = manifest.routes.filter(({ reason }) => reason !== "api");
  const routes = new Map(manifest.routes.map((entry) => [entry.route, entry]));
  const expectedRoutes = [...INDEXABLE_PUBLIC_PATHS, "/404"];

  assert.deepEqual(new Set(routes.keys()), new Set(expectedRoutes));
  assert.equal(manifest.routes.length, expectedRoutes.length);
  assert.ok(
    manifest.routes.every(({ status }) => status === "rendered"),
    "expected zero skipped, error, or fatal prerender statuses",
  );

  for (const route of expectedRoutes) {
    const entry = routes.get(route);
    const artifactStem = route === "/" ? "index" : route.slice(1);

    assert.ok(entry, `expected prerender manifest entry for ${route}`);
    assert.equal(entry.status, "rendered");
    assert.equal(entry.revalidate, false);
    assert.ok(
      (await stat(
        path.join(distServer, "prerendered-routes", `${artifactStem}.html`),
      )).isFile(),
      `expected HTML artifact for ${route}`,
    );

    if (route !== "/404") {
      assert.ok(
        (await stat(
          path.join(distServer, "prerendered-routes", `${artifactStem}.rsc`),
        )).isFile(),
        `expected RSC artifact for ${route}`,
      );
    }
  }
});

test("does not expose an unpublished personalized nutrition route", async () => {
  const response = await render("/nutrition/personalized-diet-plan");
  assert.equal(response.status, 404);
});

test("keeps preview hosts out of search results", async () => {
  const response = await render("/", "https://joy-health-preview.pages.dev");
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
});

test("serves responsive hero images with first-scene preload priority", async () => {
  const homeResponse = await render("/");
  const html = await homeResponse.text();
  const heroImages = [
    "joy-health-morning",
    "joy-health-balanced-meal",
    "joy-health-garden-recovery",
  ];
  const sizes =
    "(max-width: 760px) 100vw, (max-width: 1180px) 50vw, 836px";

  for (const image of heroImages) {
    assert.match(
      html,
      new RegExp(
        `<img[^>]*src="/images/responsive/hero/${image}-1672\\.webp"[^>]*sizes="${escapeRegex(sizes)}"[^>]*width="1672"[^>]*height="941"`,
        "i",
      ),
    );
    assert.doesNotMatch(html, new RegExp(`/_next/image\\?[^"']*${image}`, "i"));

    for (const width of [640, 1024, 1672]) {
      const candidatePath = `/images/responsive/hero/${image}-${width}.webp`;
      assert.match(
        html,
        new RegExp(`${escapeRegex(candidatePath)} ${width}w`, "i"),
      );
      const response = await worker.fetch(
        new Request(`https://joyhealth.cc${candidatePath}`, {
          headers: { accept: "image/webp" },
        }),
        env,
        ctx,
      );

      assert.equal(response.status, 200, candidatePath);
      assert.equal(response.headers.get("location"), null);
      assert.equal(response.headers.get("content-type"), "image/webp");
    }
  }

  assert.equal(html.match(/loading="eager"/gi)?.length, 1);
  assert.equal(html.match(/fetchPriority="high"/gi)?.length, 2);
  // Two lazy hero scenes plus the four lazy product-shelf photos.
  assert.equal(html.match(/loading="lazy"/gi)?.length, 6);
  assert.match(
    html,
    new RegExp(
      `<link rel="preload" as="image"[^>]+joy-health-morning-640\\.webp[^>]+imageSizes="${escapeRegex(sizes)}"[^>]+fetchPriority="high"`,
      "i",
    ),
  );
});

test("serves every stylesheet and script emitted by the home page", async () => {
  const homeResponse = await render("/");
  const html = await homeResponse.text();
  const assetPaths = [
    ...new Set(
      [...html.matchAll(/(?:src|href)="([^"]+)"/gi)]
        .map((match) => match[1])
        .filter((path) => /^\/_next\/static\/.*\.(?:css|js)$/.test(path)),
    ),
  ];

  assert.ok(assetPaths.some((path) => path.endsWith(".css")));
  assert.ok(assetPaths.some((path) => path.endsWith(".js")));

  for (const path of assetPaths) {
    const response = await worker.fetch(
      new Request(new URL(path, "https://joyhealth.cc")),
      env,
      ctx,
    );

    assert.equal(response.status, 200, path);
    assert.match(
      response.headers.get("content-type") ?? "",
      path.endsWith(".css") ? /^text\/css\b/i : /javascript/i,
      path,
    );
  }
});

test("forwards local Vite preview assets before app routing", async () => {
  const requestedPaths = [];
  const previewEnv = {
    ASSETS: {
      fetch: async (request) => {
        const path = new URL(request.url).pathname;
        requestedPaths.push(path);
        return new Response(path === "/app/globals.css" ? "body {}" : "export {};", {
          headers: {
            "content-type": path.endsWith(".css")
              ? "text/css; charset=utf-8"
              : "text/javascript; charset=utf-8",
          },
        });
      },
    },
  };

  const [cssResponse, runtimeResponse] = await Promise.all([
    worker.fetch(
      new Request("http://localhost/app/globals.css", {
        headers: { accept: "text/css" },
      }),
      previewEnv,
      ctx,
    ),
    worker.fetch(
      new Request("http://localhost/@id/virtual:vite-rsc/entry-browser"),
      previewEnv,
      ctx,
    ),
  ]);

  assert.equal(cssResponse.status, 200);
  assert.match(cssResponse.headers.get("content-type") ?? "", /^text\/css\b/i);
  assert.equal(runtimeResponse.status, 200);
  assert.match(
    runtimeResponse.headers.get("content-type") ?? "",
    /javascript/i,
  );
  assert.equal(cssResponse.headers.get("x-content-type-options"), "nosniff");
  assert.deepEqual(requestedPaths.sort(), [
    "/@id/virtual:vite-rsc/entry-browser",
    "/app/globals.css",
  ]);
});

test("redirects production variants to the canonical HTTPS hostname", async () => {
  const [wwwResponse, httpResponse] = await Promise.all([
    render("/nutrition?source=www", "https://www.joyhealth.cc"),
    render("/standards", "http://joyhealth.cc"),
  ]);

  assert.equal(wwwResponse.status, 308);
  assert.equal(
    wwwResponse.headers.get("location"),
    "https://joyhealth.cc/nutrition?source=www",
  );
  assert.equal(httpResponse.status, 308);
  assert.equal(
    httpResponse.headers.get("location"),
    "https://joyhealth.cc/standards",
  );
});

test("returns a useful custom 404", async () => {
  const response = await render("/this-page-does-not-exist");
  assert.equal(response.status, 404);
  const html = await response.text();
  assert.match(html, /We can(?:&#x27;|')t find that page/i);
  assert.match(html, /<title>Page not found \| Joy Health<\/title>/i);
  assert.match(html, /<meta name="robots" content="noindex, nofollow"/i);
});

test("self-hosts the licensed display font without a runtime font service", async () => {
  const [css, license, font] = await Promise.all([
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(
      new URL("../public/fonts/fraunces-OFL.txt", import.meta.url),
      "utf8",
    ),
    stat(
      new URL(
        "../public/fonts/fraunces-variable.woff2",
        import.meta.url,
      ),
    ),
  ]);

  assert.match(css, /font-family: "Fraunces"/i);
  assert.match(
    css,
    /src: url\("\/fonts\/fraunces-variable\.woff2"\) format\("woff2"\)/i,
  );
  assert.match(css, /font-weight: 100 900/i);
  assert.match(css, /--display: "Fraunces"/i);
  assert.match(css, /h1,[\s\S]*?h2,[\s\S]*?h3 \{[\s\S]*?font-weight: 620/i);
  assert.doesNotMatch(css, /fonts\.(?:googleapis|gstatic)\.com/i);
  assert.match(license, /Copyright 2018 The Fraunces Project Authors/i);
  assert.match(license, /SIL OPEN FONT LICENSE Version 1\.1/i);
  assert.ok(font.size > 50_000 && font.size < 100_000);
});

test("deploys directly to Cloudflare Workers without a Sites dependency", async () => {
  const [wranglerSource, packageSource, viteSource] = await Promise.all([
    readFile(new URL("../wrangler.jsonc", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../vite.config.ts", import.meta.url), "utf8"),
  ]);
  const wrangler = JSON.parse(wranglerSource);
  const packageJson = JSON.parse(packageSource);

  assert.equal(wrangler.name, "joy-health");
  assert.equal(wrangler.main, "./worker/index.ts");
  assert.equal(wrangler.workers_dev, false);
  assert.deepEqual(wrangler.routes, [
    { pattern: "joyhealth.cc", custom_domain: true },
    { pattern: "www.joyhealth.cc", custom_domain: true },
  ]);
  assert.deepEqual(wrangler.assets, {
    binding: "ASSETS",
    run_worker_first: true,
  });
  assert.equal(
    packageJson.scripts["deploy:worker"],
    "wrangler deploy --config dist/server/wrangler.json",
  );
  assert.equal(
    packageJson.scripts.deploy,
    "npm run check && npm run deploy:worker",
  );
  assert.equal(packageJson.scripts["preview:worker"], undefined);
  assert.equal(packageJson.devDependencies["@openai/sites-vite-plugin"], undefined);
  assert.match(viteSource, /configPath:\s*"\.\/wrangler\.jsonc"/);
  assert.doesNotMatch(viteSource, /openai\/sites-vite-plugin|\bsites\(\)/);
  await assert.rejects(
    stat(new URL("../.openai/hosting.json", import.meta.url)),
    (error) => error?.code === "ENOENT",
  );
});


test("audits all sitemap pages, unique metadata, links, fragments, and structured data", async () => {
  const result = await auditSeo(render);
  assert.equal(result.pages, INDEXABLE_PUBLIC_PATHS.length);
});

test("normalizes combined canonical variants in one redirect without losing query strings", async () => {
  for (const pathname of [...INDEXABLE_PUBLIC_PATHS, "/sitemap.xml", "/robots.txt"]) {
    const variant = pathname === "/" ? "/" : `${pathname}/`;
    const request = new Request(`http://www.joyhealth.cc${variant}?source=a%26b`);
    const response = await worker.fetch(request, env, ctx);
    assert.equal(response.status, 308);
    assert.equal(response.headers.get("location"), `https://joyhealth.cc${pathname}?source=a%26b`);
    const target = await worker.fetch(new Request(response.headers.get("location")), env, ctx);
    assert.equal(target.status, 200);
  }
  const duplicateSlash = await worker.fetch(new Request("https://joyhealth.cc//nutrition///hydration/"), env, ctx);
  assert.equal(duplicateSlash.status, 308);
  assert.equal(duplicateSlash.headers.get("location"), "https://joyhealth.cc/nutrition/hydration");
});

test("HEAD preserves GET status and metadata without sending a response body", async () => {
  for (const pathname of [...INDEXABLE_PUBLIC_PATHS, "/sitemap.xml", "/robots.txt", "/missing"]) {
    const get = await render(pathname);
    const head = await worker.fetch(new Request(`https://joyhealth.cc${pathname}`, { method: "HEAD" }), env, ctx);
    assert.equal(head.status, get.status, pathname);
    assert.equal(head.headers.get("content-type"), get.headers.get("content-type"), pathname);
    assert.equal(await head.text(), "", pathname);
  }
});


test("sitemap audit rejects corrupted XML, duplicates, noncanonical URLs, and dishonest dates", () => {
  const wrap = (entries) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`;
  const valid = "<url><loc>https://joyhealth.cc/</loc></url>";
  assert.equal(sitemapEntries(wrap(valid)).length, 1);
  for (const body of [
    valid + valid,
    valid + "<unexpected/>",
    valid.replace("</loc>", "</broken>"),
    valid.replace("https:", "http:"),
    valid.replace("joyhealth.cc/", "www.joyhealth.cc/"),
    valid.replace("joyhealth.cc/", "joyhealth.cc/nutrition/"),
    valid.replace("joyhealth.cc/", "joyhealth.cc/?tracking=1"),
    valid.replace("</url>", "<lastmod>2026-02-30</lastmod></url>"),
    valid.replace("</url>", "<lastmod>2999-01-01</lastmod></url>"),
  ]) assert.throws(() => sitemapEntries(wrap(body)), body);
});

async function sitemapPaths() {
  const xml = await (await render("/sitemap.xml")).text();
  return sitemapEntries(xml).map(({ location, lastModified }) => ({
    pathname: new URL(location).pathname,
    location,
    lastModified,
  }));
}

function requestWithAccept(pathname, accept, method = "GET") {
  return worker.fetch(
    new Request(`https://joyhealth.cc${pathname}`, { method, headers: { accept } }),
    env,
    ctx,
  );
}

test("publishes a noindexed Markdown twin of every sitemap page that matches its HTML", async () => {
  for (const { pathname, location } of await sitemapPaths()) {
    const html = await (await render(pathname)).text();
    assert.ok(
      html.includes(`<link rel="alternate" type="text/markdown" href="https://joyhealth.cc${markdownPath(pathname)}"/>`),
      `${pathname}: Markdown alternate link`,
    );
    const response = await requestWithAccept(markdownPath(pathname), "*/*");
    assert.equal(response.status, 200, pathname);
    assert.equal(response.headers.get("content-type"), "text/markdown; charset=utf-8");
    assert.equal(response.headers.get("x-robots-tag"), "noindex", pathname);
    const markdown = await response.text();
    assert.match(markdown, new RegExp(`^---\\n[\\s\\S]*?\\ncanonical_url: ${escapeRegex(new URL(location).href)}\\n`));
    const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)[1].replace(/<[^>]+>/g, "").replace(/&#x27;|&apos;/g, "'").replace(/&amp;/g, "&");
    assert.ok(markdown.includes(`# ${h1.trim()}`), `${pathname}: H1 carried into Markdown`);
    assert.doesNotMatch(markdown, /<[a-z][^>]*>|&(?:amp|quot|#x27);/i, `${pathname}: HTML residue`);
    // Affiliate disclosures stay beside storefront links in the mirror.
    for (const [line] of markdown.matchAll(/^.*sissi\.usana\.com.*$/gm)) {
      const context = markdown.slice(Math.max(0, markdown.indexOf(line) - 600), markdown.indexOf(line) + line.length + 600);
      assert.match(context, /affiliate|commission/i, `${pathname}: storefront link without nearby disclosure`);
    }
  }
});

test("negotiates Markdown on canonical URLs without noindexing the canonical page", async () => {
  const markdown = await requestWithAccept("/nutrition/hydration", "text/markdown, text/html, */*");
  assert.equal(markdown.status, 200);
  assert.equal(markdown.headers.get("content-type"), "text/markdown; charset=utf-8");
  assert.match(markdown.headers.get("vary") ?? "", /\bAccept\b/);
  assert.equal(markdown.headers.get("x-robots-tag"), null);
  assert.match(await markdown.text(), /^---\ntitle: "How much water should you drink each day\?/);

  for (const accept of [
    "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "text/html, text/markdown;q=0.5",
    "*/*",
  ]) {
    const html = await requestWithAccept("/nutrition/hydration", accept);
    assert.match(html.headers.get("content-type") ?? "", /^text\/html\b/, accept);
    assert.match(html.headers.get("vary") ?? "", /\bAccept\b/, accept);
  }

  const head = await requestWithAccept("/nutrition/hydration.md", "*/*", "HEAD");
  assert.equal(head.status, 200);
  assert.equal(await head.text(), "");
  assert.equal((await requestWithAccept("/nutrition/not-a-guide.md", "*/*")).status, 404);
  assert.match(
    (await requestWithAccept("/sitemap.xml", "text/markdown")).headers.get("content-type") ?? "",
    /xml/,
  );
});

test("publishes llms.txt and llms-full.txt covering exactly the sitemap", async () => {
  const pages = await sitemapPaths();
  const llms = await requestWithAccept("/llms.txt", "*/*");
  assert.equal(llms.status, 200);
  assert.equal(llms.headers.get("content-type"), "text/plain; charset=utf-8");
  assert.equal(llms.headers.get("x-robots-tag"), "noindex");
  const index = await llms.text();
  assert.match(index, /^# Joy Health\n\n> .+\n/);
  assert.match(index, /not individualized medical advice/);
  assert.match(index, /affiliate links, disclosed next to each link/);
  const listed = [...index.matchAll(/^- \[[^\]]+\]\((https:\/\/joyhealth\.cc[^)]*)\):/gm)].map(([, url]) => url);
  assert.deepEqual(
    new Set(listed),
    new Set([
      ...pages.map(({ location }) => new URL(location).href),
      "https://joyhealth.cc/llms-full.txt",
      "https://joyhealth.cc/data/supplement-labels.json",
      "https://joyhealth.cc/data/supplement-labels.csv",
    ]),
  );
  const full = await (await requestWithAccept("/llms-full.txt", "*/*")).text();
  for (const { location } of pages) {
    assert.ok(full.includes(`canonical_url: ${new URL(location).href}\n`), location);
  }
});

test("publishes an RSS feed of dated publications with editorial dates only", async () => {
  const response = await render("/feed.xml");
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "application/rss+xml; charset=utf-8");
  const xml = await response.text();
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>\n<rss version="2\.0"/);
  assert.doesNotMatch(xml, /<lastBuildDate>/);
  const items = [...xml.matchAll(/<item>\n<title>([^<]+)<\/title>\n<link>([^<]+)<\/link>[\s\S]*?<pubDate>([^<]+)<\/pubDate>\n<\/item>/g)];
  const dated = (await sitemapPaths()).filter(({ pathname }) => pathname.startsWith("/nutrition/") || pathname.startsWith("/supplements/"));
  assert.equal(items.length, dated.length);
  const dates = items.map(([, , , pubDate]) => new Date(pubDate).toISOString().slice(0, 10));
  assert.deepEqual(dates, [...dates].sort().reverse(), "newest first");
  for (const [, , link, pubDate] of items) {
    const entry = dated.find(({ location }) => new URL(location).href === link);
    assert.ok(entry, link);
    const html = await (await render(entry.pathname)).text();
    const published = html.match(/<meta property="article:published_time" content="([^"]+)"/)?.[1];
    assert.equal(new Date(pubDate).toISOString().slice(0, 10), published, link);
  }
});

test("Markdown conversion keeps content and drops navigation chrome", () => {
  const html = `<html><head><title>T | Joy Health</title><meta name="description" content="D"/><link rel="canonical" href="https://joyhealth.cc/x"/></head><body><main>
    <nav aria-label="Breadcrumb"><a href="/">Home</a></nav><nav><a href="#a">Jump</a></nav>
    <h1>Title &amp; more</h1><p>Claim.<sup class="citation"><a href="#source-1">[<!-- -->1<!-- -->]</a></sup> See <a href="#quality">quality</a> and <a href="/y">why_this</a>.</p>
    <span aria-hidden="true">01</span><button>Flip</button><script>ignored()</script>
    <dl><div><dt>Term</dt><dd>Meaning</dd></div></dl>
    <table><tr><th>A</th><th>B</th></tr><tr><td>1 | 2</td><td>3</td></tr></table>
    <ol><li><h3>Step</h3><p>Do it.</p></li></ol></main></body></html>`;
  const { markdown } = pageToMarkdown(html);
  assert.match(markdown, /^---\ntitle: "T \| Joy Health"\ndescription: "D"\ncanonical_url: https:\/\/joyhealth\.cc\/x\n/);
  assert.match(markdown, /# Title & more/);
  assert.match(markdown, /Claim\.\[1\] See \[quality\]\(https:\/\/joyhealth\.cc\/x#quality\) and \[why\\_this\]\(https:\/\/joyhealth\.cc\/y\)\./);
  assert.match(markdown, /- \*\*Term\*\* — Meaning/);
  assert.match(markdown, /\| A \| B \|\n\| --- \| --- \|\n\| 1 \\\| 2 \| 3 \|/);
  assert.match(markdown, /1\. \*\*Step\*\*\n\n {3}Do it\./);
  assert.doesNotMatch(markdown, /Home|Jump|01|Flip|ignored/);
});


function jsonLdBlocks(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map(([, json]) => JSON.parse(json));
}

function overLimitRows(html) {
  return [...html.matchAll(/<tr class="is-over-limit"><th scope="row">([^<]+)<\/th>/g)].map(([, name]) => name);
}

test("publishes a label page per product with text tables, sources, and adjacent disclosures", async () => {
  for (const pathname of SUPPLEMENT_PAGES) {
    const response = await render(pathname);
    assert.equal(response.status, 200, pathname);
    const html = await response.text();
    assert.match(html, /<title>USANA [^<]+ \| Joy Health<\/title>/, pathname);
    assert.match(html, /<table class="facts-table"><caption>(?:Supplement|Nutrition) Facts/, pathname);
    const productImage = html.match(/<meta property="og:image" content="https:\/\/joyhealth\.cc(\/images\/usana\/[a-z-]+-product\.png)"/);
    assert.ok(productImage, `${pathname}: product photo as social image`);

    const citations = [...html.matchAll(/href="#source-(\d+)"/g)].map(([, number]) => Number(number));
    const sources = [...html.matchAll(/<li id="source-(\d+)">/g)].map(([, number]) => Number(number));
    assert.ok(citations.length > 0, `${pathname}: cites sources`);
    assert.deepEqual(sources, sources.map((_, index) => index + 1), `${pathname}: sources numbered in order`);
    for (const number of citations) assert.ok(number <= sources.length, `${pathname}: citation ${number} has a source`);

    for (const [link] of html.matchAll(/<a href="https:\/\/sissi\.usana\.com\/"[^>]*>/g)) {
      assert.match(link, /rel="sponsored"/, `${pathname}: sponsored rel`);
    }
    assert.match(
      html,
      /<strong>Affiliate disclosure:<\/strong>[^<]*commission[\s\S]{0,400}<a href="https:\/\/sissi\.usana\.com\/" rel="sponsored">/,
      `${pathname}: disclosure beside the storefront link`,
    );

    const breadcrumb = jsonLdBlocks(html).find((item) => item["@type"] === "BreadcrumbList");
    assert.deepEqual(
      breadcrumb.itemListElement.map(({ item }) => item),
      ["https://joyhealth.cc/", "https://joyhealth.cc/usana", `https://joyhealth.cc${pathname}`],
    );
    assert.match(html, /<nav class="breadcrumbs" aria-label="Breadcrumb">[\s\S]*?href="\/usana">Supplements<\/a>/);
  }
});

test("prints label amounts as text and flags upper limits exactly where the arithmetic exceeds them", async () => {
  const expectations = {
    "/supplements/biomega": { text: [/EPA<span class="facts-form"> \(Eicosapentaenoic Acid\)<\/span><\/th><td>640 mg/, /DHA<span[^>]*>[^<]*<\/span><\/th><td>460 mg/], over: [] },
    "/supplements/cellsentials": { text: [/Niacin<span[^>]*>[^<]*<\/span><\/th><td>20 mg NE/, /Vita Antioxidant, CellSentials/, /Core Minerals, CellSentials/], over: ["Niacin"] },
    "/supplements/healthpak": { text: [/Alpha-Lipoic Acid<\/th><td>125 mg/, /Pterocarpus Marsupium Extract/], over: ["Niacin", "Magnesium"], absent: [/Astaxanthin<\/th>/] },
    "/supplements/magnecal-d": { text: [/Magnesium<span[^>]*>[^<]*<\/span><\/th><td>260 mg/, /two \(2\) tablets twice daily/], over: ["Magnesium"] },
    "/supplements/procosa": { text: [/Glucosamine HCL<span[^>]*>[^<]*<\/span><\/th><td>1500 mg/], over: [] },
    "/supplements/coquinone-30": { text: [/Coenzyme Q10<\/th><td>30 mg/], over: [] },
    "/supplements/clear-protein-creatine": { text: [/<caption>Nutrition Facts/, /Protein<\/th><td>10 g/], over: [] },
    "/supplements/core-aminos": { text: [/Calcium<\/th><td>290 mg<\/td><td>29%/, /L-Leucine<span[^>]*>[^<]*<\/span><\/th><td>2000 mg/], over: [] },
  };
  for (const [pathname, { text, over, absent = [] }] of Object.entries(expectations)) {
    // React separates adjacent text nodes with empty comments.
    const html = (await (await render(pathname)).text()).replace(/<!-- -->/g, "");
    for (const pattern of text) assert.match(html, pattern, `${pathname}: ${pattern}`);
    for (const pattern of absent) assert.doesNotMatch(html, pattern, `${pathname}: ${pattern}`);
    assert.deepEqual(overLimitRows(html), over, `${pathname}: rows above the UL`);
  }
  const hub = (await (await render("/usana")).text()).replace(/<!-- -->/g, "");
  const matrix = hub.match(/<table class="facts-table daily-table overlap-matrix">[\s\S]*?<\/table>/)?.[0];
  assert.ok(matrix, "overlap matrix on /usana");
  assert.deepEqual(
    [...matrix.matchAll(/<th scope="row">([^<]+)<\/th>/g)].map(([, name]) => name),
    ["Vitamin C", "Vitamin D", "Niacin", "Calcium", "Magnesium", "Manganese", "Boron"],
  );
  assert.equal((matrix.match(/class="is-over-limit"/g) ?? []).length, 4);
  for (const pathname of SUPPLEMENT_PAGES.filter((path) => !path.endsWith("coquinone-30"))) {
    assert.match(hub, new RegExp(`href="${escapeRegex(pathname)}"`), `/usana links ${pathname}`);
  }
  const productList = jsonLdBlocks(hub).find((item) => item["@type"] === "ItemList");
  assert.ok(productList.itemListElement.every(({ item }) => item.url?.startsWith("https://joyhealth.cc/supplements/")));
});

test("publishes a source-traced creatine guide with a disclosed product example", async () => {
  const html = (await (await render("/nutrition/creatine")).text()).replace(/<!-- -->/g, "");
  assert.match(html, /<h1>Is creatine safe, and who benefits from it\?<\/h1>/);
  const article = jsonLdBlocks(html).find((item) => item["@type"] === "Article");
  assert.equal(article.datePublished, "2026-09-24");
  assert.equal(article.dateModified, undefined);
  const sources = [...html.matchAll(/<li id="source-(\d+)">/g)].length;
  for (const [, number] of html.matchAll(/href="#source-(\d+)"/g)) assert.ok(Number(number) <= sources);
  assert.match(html, /EFSA Journal, 2024/);
  assert.match(html, /Abstract only/);
  assert.match(
    html,
    /href="\/supplements\/clear-protein-creatine"[\s\S]{0,600}<strong>Disclosure:<\/strong> Joy Health earns a commission/,
  );
  const related = await (await render("/nutrition/supplement-evidence-and-safety")).text();
  assert.match(related, /href="\/nutrition\/creatine"/);
});

test("describes every product page as a WebPage about a DietarySupplement, citing its visible sources", async () => {
  for (const pathname of SUPPLEMENT_PAGES) {
    const html = (await (await render(pathname)).text()).replace(/<!-- -->/g, "");
    const graph = jsonLdBlocks(html).find((item) => item["@graph"])?.["@graph"];
    assert.ok(graph, `${pathname}: @graph`);
    const page = graph.find((node) => node["@type"] === "WebPage");
    const supplement = graph.find((node) => node["@type"] === "DietarySupplement");
    assert.equal(page.url, `https://joyhealth.cc${pathname}`);
    assert.equal(page.about["@id"], supplement["@id"]);
    assert.equal(supplement.offers, undefined, `${pathname}: no invented offers`);
    assert.equal(supplement.aggregateRating, undefined, `${pathname}: no invented ratings`);
    // Citations are exactly the visible numbered source list, in order.
    const visible = [...html.matchAll(/<li id="source-\d+"><a href="([^"]+)"/g)].map(([, url]) => url.replace(/&amp;/g, "&"));
    assert.deepEqual(page.citation.map(({ url }) => url), visible, `${pathname}: citation matches sources`);
    // Every ingredient string is a row printed in the visible label table.
    assert.ok(supplement.activeIngredient.length > 0);
    for (const ingredient of supplement.activeIngredient) {
      const [name] = ingredient.split(/ (?=[<\d])/);
      assert.ok(html.includes(`<th scope="row">${name.replace(/&/g, "&amp;")}`), `${pathname}: ${name} visible`);
    }
    for (const thing of page.mentions) assert.equal(thing["@type"], "Thing");
  }
  const magnecal = jsonLdBlocks(await (await render("/supplements/magnecal-d")).text()).find((item) => item["@graph"])["@graph"];
  assert.match(magnecal.find((node) => node["@type"] === "DietarySupplement").recommendedIntake.description, /two \(2\) tablets twice daily/i);
});

test("links guides to their topics and cites the creatine guide's sources in structured data", async () => {
  const creatine = (await (await render("/nutrition/creatine")).text()).replace(/<!-- -->/g, "");
  const article = jsonLdBlocks(creatine).find((item) => item["@type"] === "Article");
  assert.deepEqual(article.about.map(({ sameAs }) => sameAs[0]), ["https://www.wikidata.org/wiki/Q223600"]);
  const visible = [...creatine.matchAll(/<li id="source-\d+"><a href="([^"]+)"/g)].map(([, url]) => url.replace(/&amp;/g, "&"));
  assert.deepEqual(article.citation.map(({ url }) => url), visible);
  for (const [pathname] of GUIDE_PUBLICATIONS) {
    const guide = jsonLdBlocks(await (await render(pathname)).text()).find((item) => item["@type"] === "Article");
    assert.ok(guide.about || guide.mentions, `${pathname}: topic entities`);
  }
  const home = jsonLdBlocks(await (await render("/")).text()).find((item) => item["@type"] === "Organization");
  assert.equal(home.correctionsPolicy, "https://joyhealth.cc/standards#how-we-correct-errors");
  assert.match(await (await render("/standards")).text(), /<section id="how-we-correct-errors">/);
});

test("publishes the label transcriptions as a described, downloadable dataset that matches the pages", async () => {
  const hub = await (await render("/usana")).text();
  const dataset = jsonLdBlocks(hub).find((item) => item["@type"] === "Dataset");
  assert.equal(dataset["@id"], "https://joyhealth.cc/usana#label-data");
  assert.match(hub, /<h3 id="label-data">Download the label data<\/h3>/);
  assert.ok(dataset.description.length >= 50 && dataset.description.length <= 5000);
  assert.equal(dataset.license, "https://creativecommons.org/licenses/by/4.0/");
  assert.match(hub, /<a href="https:\/\/creativecommons\.org\/licenses\/by\/4\.0\/" rel="license">CC BY 4\.0<\/a>/);
  const formats = Object.fromEntries(dataset.distribution.map(({ encodingFormat, contentUrl }) => [encodingFormat, new URL(contentUrl).pathname]));
  assert.deepEqual(formats, { "application/json": "/data/supplement-labels.json", "text/csv": "/data/supplement-labels.csv" });

  const jsonResponse = await render(formats["application/json"]);
  assert.equal(jsonResponse.headers.get("content-type"), "application/json; charset=utf-8");
  const data = await jsonResponse.json();
  assert.equal(data.license, dataset.license);
  assert.deepEqual(data.products.map(({ page }) => new URL(page).pathname), SUPPLEMENT_PAGES);
  const exceeded = data.products.flatMap(({ slug, dailyAmounts }) =>
    dailyAmounts.filter(({ upperLimit }) => upperLimit?.exceededAtLabelDirections).map(({ ingredient }) => `${slug}:${ingredient}`));
  assert.deepEqual(exceeded.sort(), ["cellsentials:niacin", "healthpak:magnesium", "healthpak:niacin", "magnecal-d:magnesium"]);
  const magnesium = data.products.find(({ slug }) => slug === "magnecal-d").dailyAmounts.find(({ ingredient }) => ingredient === "magnesium");
  assert.equal(magnesium.max, 520);

  const csvResponse = await render(formats["text/csv"]);
  assert.equal(csvResponse.headers.get("content-type"), "text/csv; charset=utf-8");
  const csv = await csvResponse.text();
  const rowCount = data.products.reduce((sum, { panels }) => sum + panels.reduce((total, { rows }) => total + rows.length, 0), 0);
  assert.equal(csv.trimEnd().split("\n").length, rowCount + 1);
  assert.match(csv, /^product_slug,product_name,panel,/);
  assert.match(csv, /\nmagnecal-d,MagneCal D,[^\n]*Magnesium,[^\n]*,260,mg,/);
});

test("revalidates crawlable responses with ETags and advertises the Markdown twin in headers", async () => {
  for (const pathname of ["/nutrition/hydration", "/nutrition/hydration.md", "/llms.txt", "/sitemap.xml", "/data/supplement-labels.json"]) {
    const first = await requestWithAccept(pathname, "*/*");
    const tag = first.headers.get("etag");
    assert.match(tag ?? "", /^"[0-9a-f]{32}"$/, `${pathname}: ETag`);
    await first.arrayBuffer();
    const again = await requestWithAccept(pathname, "*/*");
    assert.equal(again.headers.get("etag"), tag, `${pathname}: stable ETag`);
    await again.arrayBuffer();
    const conditional = await worker.fetch(
      new Request(`https://joyhealth.cc${pathname}`, { headers: { accept: "*/*", "if-none-match": `W/${tag}` } }),
      env,
      ctx,
    );
    assert.equal(conditional.status, 304, `${pathname}: 304 on match`);
    assert.equal(await conditional.text(), "");
    const stale = await worker.fetch(
      new Request(`https://joyhealth.cc${pathname}`, { headers: { accept: "*/*", "if-none-match": '"stale"' } }),
      env,
      ctx,
    );
    assert.equal(stale.status, 200, `${pathname}: 200 on mismatch`);
  }
  const html = await render("/supplements/procosa");
  assert.match(html.headers.get("link") ?? "", /<https:\/\/joyhealth\.cc\/supplements\/procosa\.md>; rel="alternate"; type="text\/markdown"/);
  assert.equal((await render("/not-a-page")).headers.get("etag"), null);
});

test("serves robots content signals and the IndexNow key file", async () => {
  const robots = await (await render("/robots.txt")).text();
  assert.match(robots, /^User-agent: \*\nContent-Signal: search=yes, ai-input=yes, ai-train=yes\nAllow: \/\n/);
  const { readdir } = await import("node:fs/promises");
  const [keyFile] = (await readdir(new URL("../public/", import.meta.url))).filter((name) => /^[0-9a-f]{32}\.txt$/.test(name));
  assert.ok(keyFile, "IndexNow key file in public/");
  const response = await render(`/${keyFile}`);
  assert.equal(response.status, 200);
  assert.equal((await response.text()).trim(), keyFile.replace(/\.txt$/, ""));
});

test("keeps HTML section ids as Markdown heading anchors", async () => {
  const markdown = await (await requestWithAccept("/supplements/magnecal-d.md", "*/*")).text();
  const html = await (await render("/supplements/magnecal-d")).text();
  const anchors = [...markdown.matchAll(/^#{1,6} .+ \{#([^}]+)\}$/gm)].map(([, id]) => id);
  assert.ok(anchors.includes("daily-title"), "daily-title anchor");
  for (const id of anchors) assert.match(html, new RegExp(`\\sid="${escapeRegex(id)}"`), `#${id} exists in HTML`);
});

test("numbers every page's sources by first appearance, top to bottom", async () => {
  for (const { pathname } of await sitemapPaths()) {
    const html = await (await render(pathname)).text();
    const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
    const listStart = main.search(/<ol class="source-list/);
    const body = listStart > 0 ? main.slice(0, listStart) : main;
    const firstSeen = [];
    for (const [, number] of body.matchAll(/href="#(?:usana-)?source-(\d+)"/g)) {
      if (!firstSeen.includes(Number(number))) firstSeen.push(Number(number));
    }
    assert.deepEqual(firstSeen, firstSeen.map((_, index) => index + 1), `${pathname}: citations out of order`);
    const listed = [...main.matchAll(/<li id="(?:usana-)?source-(\d+)"/g)].map(([, number]) => Number(number));
    assert.deepEqual(listed, listed.map((_, index) => index + 1), `${pathname}: source list numbering`);
    assert.ok(firstSeen.length <= listed.length, `${pathname}: citation without a listed source`);
  }
});
