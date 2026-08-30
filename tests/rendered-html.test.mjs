import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

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
  waitUntil() {},
  passThroughOnException() {},
};

function render(path, origin = "https://joyhealth.cc") {
  return worker.fetch(
    new Request(new URL(path, origin), { headers: { accept: "text/html" } }),
    env,
    ctx,
  );
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
    /<title>Joy Health \| Nutrition guides that show their work<\/title>/i,
  );
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/joyhealth\.cc\/?"/i,
  );
  assert.match(
    html,
    /<meta property="og:image" content="https:\/\/joyhealth\.cc\/og\.png"/i,
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
    /href="\/nutrition#guides-title"[^>]*>[\s\S]*Browse 7 practical guides/i,
  );
  assert.match(
    html,
    /href="\/usana"[^>]*>USANA<\/a>/i,
  );
  assert.match(html, /<span aria-hidden="true">02<\/span>\s*Featured partner · USANA/i);
  assert.match(html, /Build a better routine with products worth understanding\./i);
  assert.match(html, /href="\/usana"[^>]*>[\s\S]*Explore USANA/i);
  assert.match(html, /href="\/usana#quality"[^>]*>See the quality evidence/i);
  assert.doesNotMatch(html, /class="guide-index"/i);
  assert.doesNotMatch(html, /href="\/nutrition\/building-balanced-meals"/i);
  assert.doesNotMatch(html, /href="\/nutrition\/protein-and-fiber"/i);
  assert.equal(
    html.match(/<a[^>]*href="https:\/\/sissi\.usana\.com\/"/gi)?.length,
    1,
    "expected exactly one rendered storefront link on the home page",
  );
  assert.match(
    html,
    /Featured partner · USANA[\s\S]*class="brand-feature-catalog"[\s\S]*href="https:\/\/sissi\.usana\.com\/"[^>]*rel="sponsored"/i,
  );
  assert.match(html, /See current products and prices/i);
  assert.match(html, /<span aria-hidden="true">03<\/span>\s*How we work/i);
  assert.doesNotMatch(html, /—/);
  assert.match(html, /general education, not medical advice/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);

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
    /<meta property="og:image" content="https:\/\/joyhealth\.cc\/og\.png"/i,
  );
  assert.match(html, /<meta property="og:type" content="website"/i);
  assert.match(html, /<meta property="og:site_name" content="Joy Health"/i);
  assert.match(html, /Disclosures where they matter/i);
});

test("publishes a source-linked USANA quality and innovation page", async () => {
  const response = await render("/usana");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /<title>USANA quality and product innovation \| Joy Health<\/title>/i,
  );
  assert.match(
    html,
    /<meta name="description" content="A source-linked look at USANA manufacturing, third-party listings, product quality, and innovation, with an explanation of what each signal can establish\."/i,
  );
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/joyhealth\.cc\/usana"/i,
  );
  assert.match(
    html,
    /<meta property="og:url" content="https:\/\/joyhealth\.cc\/usana"/i,
  );
  assert.match(html, /<h1[^>]*>Look past the bottle\. See how the product is built\.<\/h1>/i);
  assert.match(html, /aria-current="page"[^>]*>USANA<\/a>/i);
  assert.match(html, /67%[\s\S]*manufacturing, production, and quality control/i);
  assert.match(html, /12[\s\S]*NSF\/ANSI 173 official listing/i);
  assert.match(
    html,
    /href="https:\/\/standards\.nsf\.org\/discussion\/nsfansi-173-2025-dietary-supplements-uploaded"[^>]*>[\s\S]*NSF\/ANSI 173/i,
  );
  assert.match(html, /\$10\.7M[\s\S]*research and development in 2025/i);
  assert.match(html, /CellSentials was reformulated in 2025\./i);
  assert.match(html, /Decide where your journey to a healthy life starts with USANA\./i);
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
  assert.match(html, /Showing Details for CellSentials, 1 of 2\. Show Product \+ label\./i);
  assert.match(html, /Showing Details for HealthPak, 1 of 2\. Show Product \+ label\./i);
  assert.equal(
    html.match(/Showing Details for [^<"]+, 1 of 3\. Show Product\./gi)?.length,
    6,
    "expected six three-state product cards",
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
  assert.match(html, /USANA Clear Protein Drink puts clear whey in a can\./i);
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
  assert.match(html, /Reviewed August 30, 2026/i);
  assert.match(html, /https:\/\/ir\.usana\.com\/company-information/i);
  assert.match(html, /https:\/\/info\.nsf\.org\/Certified\/Dietary\/Listings\.asp/i);
  assert.match(html, /https:\/\/ir\.usana\.com\/sustainability/i);
  assert.match(html, /usana-expands-its-nutritionals-line-with-powerful-new/i);
  assert.match(html, /https:\/\/www\.fda\.gov\/food\/information-consumers-using-dietary-supplements\/questions-and-answers-dietary-supplements/i);
  assert.match(html, /<aside[^>]*class="usana-catalog-dock is-open"[^>]*id="catalog"/i);
  assert.doesNotMatch(html, /usana-catalog-grip/i);
  assert.match(html, /aria-expanded="true"[^>]*aria-controls="usana-catalog-panel"/i);
  assert.match(html, /Explore formulas, labels, and prices/i);
  assert.match(html, /You(?:&#x27;|')ll leave Joy Health for sissi\.usana\.com\./i);
  assert.doesNotMatch(html, /The useful urgency/i);
  assert.match(
    html,
    /Careful health education, with sources, context, and limits attached\./i,
  );
  assert.equal(
    html.match(/<a[^>]*href="https:\/\/sissi\.usana\.com\/"/gi)?.length,
    4,
    "expected four clearly disclosed storefront links on the USANA page",
  );
  assert.match(
    html,
    /class="usana-catalog-link"[^>]*href="https:\/\/sissi\.usana\.com\/"[^>]*rel="sponsored"[\s\S]*Affiliate link: Joy Health may earn a commission/i,
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
  assert.match(html, /<title>Nutrition essentials \| Joy Health<\/title>/i);
  assert.match(
    html,
    /<meta name="description" content="An evidence-aware nutrition library organized around food labels, nutrients, meals, hydration, and supplements\."/i,
  );
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/joyhealth\.cc\/nutrition"/i,
  );
  assert.match(
    html,
    /<meta property="og:url" content="https:\/\/joyhealth\.cc\/nutrition"/i,
  );
  assert.match(html, /<h1[^>]*>A clearer way into nutrition\.<\/h1>/i);
  assert.match(html, /Seven practical places to begin/i);
  assert.match(html, /href="\/nutrition\/building-balanced-meals"/i);
  assert.match(html, /href="\/nutrition\/protein-and-fiber"/i);
  assert.match(html, /href="\/nutrition\/reading-food-labels"/i);
  assert.match(html, /href="\/nutrition\/carbohydrates-and-fats"/i);
  assert.match(html, /href="\/nutrition\/hydration"/i);
  assert.match(html, /href="\/nutrition\/supplement-evidence-and-safety"/i);
  assert.match(html, /href="\/nutrition\/electrolyte-drinks"/i);
  assert.doesNotMatch(html, /coming soon|placeholder/i);
  assert.doesNotMatch(html, /—/);
});

test("publishes a source-traced protein-and-fiber guide with separate reference systems", async () => {
  const response = await render("/nutrition/protein-and-fiber");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(
    html,
    /<title>Protein and fiber: two different jobs in a meal \| Joy Health<\/title>/i,
  );
  assert.match(
    html,
    /<meta name="description" content="A practical guide to what protein and fiber are, where they appear in foods and Nutrition Facts labels, and why their reference values are not interchangeable personal targets\."/i,
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
    /<h1[^>]*>Protein and fiber: two different jobs in a meal<\/h1>/i,
  );
  assert.match(html, /Prepared by[\s\S]*Joy Health/i);
  assert.match(html, /Published August 28, 2026/i);
  assert.match(html, /What this means/i);
  assert.match(html, /What the references can tell us/i);
  assert.match(html, /How to use the information/i);
  assert.match(html, /Limits and open questions/i);
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
    "Protein and fiber: two different jobs in a meal",
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
  assert.match(html, /What this means/i);
  assert.match(html, /What the evidence can tell us/i);
  assert.match(html, /How to use the framework/i);
  assert.match(html, /Limits and open questions/i);
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
    /<meta name="description" content="A practical guide to serving information, nutrients, percent Daily Value, ingredients, and allergen information on FDA-regulated packaged foods in the United States\."/i,
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
  assert.match(html, /What this means/i);
  assert.match(html, /What the evidence can tell us/i);
  assert.match(html, /How to use the information/i);
  assert.match(html, /Limits and open questions/i);
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

  assert.match(html, /<title>Carbohydrates and fats: types, sources, and tradeoffs \| Joy Health<\/title>/i);
  assert.match(html, /<link rel="canonical" href="https:\/\/joyhealth\.cc\/nutrition\/carbohydrates-and-fats"/i);
  assert.match(html, /<meta property="og:url" content="https:\/\/joyhealth\.cc\/nutrition\/carbohydrates-and-fats"/i);
  assert.doesNotMatch(html, /(?:property="og:image"|name="twitter:image")/i);
  assert.match(html, /Published August 28, 2026/i);
  assert.match(html, /What this means/i);
  assert.match(html, /What guidance can tell us/i);
  assert.match(html, /How to use the information/i);
  assert.match(html, /Limits and open questions/i);
  assert.match(html, /The replacement is part of the recommendation/i);
  assert.match(html, /https:\/\/www\.who\.int\/publications\/i\/item\/9789240073630/i);
  assert.match(html, /https:\/\/cdn\.realfood\.gov\/DGA\.pdf/i);
  assert.doesNotMatch(html, /—/);

  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  assert.ok(jsonLdMatch, "expected Article JSON-LD");
  const jsonLd = JSON.parse(jsonLdMatch[1]);
  assert.equal(jsonLd["@type"], "Article");
  assert.equal(jsonLd.headline, "Carbohydrates and fats: types, sources, and tradeoffs");
  assert.equal(jsonLd.mainEntityOfPage, "https://joyhealth.cc/nutrition/carbohydrates-and-fats");
  assert.equal(jsonLd.datePublished, "2026-08-28");
  assert.equal(jsonLd.dateModified, undefined);
  assert.equal(jsonLd.image, undefined);
});

test("publishes a source-traced hydration guide that distinguishes total water", async () => {
  const response = await render("/nutrition/hydration");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /<title>Hydration: what counts and why needs vary \| Joy Health<\/title>/i);
  assert.match(html, /<link rel="canonical" href="https:\/\/joyhealth\.cc\/nutrition\/hydration"/i);
  assert.match(html, /<meta property="og:url" content="https:\/\/joyhealth\.cc\/nutrition\/hydration"/i);
  assert.doesNotMatch(html, /(?:property="og:image"|name="twitter:image")/i);
  assert.match(html, /Published August 28, 2026/i);
  assert.match(html, /What this means/i);
  assert.match(html, /What the reference can tell us/i);
  assert.match(html, /How to use the information/i);
  assert.match(html, /Limits and open questions/i);
  assert.match(html, /3\.7 liters per day for men and 2\.7 liters per day for women/i);
  assert.match(html, /not exact requirements or plain-water prescriptions/i);
  assert.match(html, /https:\/\/www\.nationalacademies\.org\/read\/10925\/chapter\/6/i);
  assert.match(html, /https:\/\/www\.cdc\.gov\/healthy-weight-growth\/water-healthy-drinks\/index\.html/i);
  assert.doesNotMatch(html, /—/);

  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  assert.ok(jsonLdMatch, "expected Article JSON-LD");
  const jsonLd = JSON.parse(jsonLdMatch[1]);
  assert.equal(jsonLd["@type"], "Article");
  assert.equal(jsonLd.headline, "Hydration: what counts and why needs vary");
  assert.equal(jsonLd.mainEntityOfPage, "https://joyhealth.cc/nutrition/hydration");
  assert.equal(jsonLd.datePublished, "2026-08-28");
  assert.equal(jsonLd.dateModified, undefined);
  assert.equal(jsonLd.image, undefined);
});

test("publishes a source-traced supplement guide with separate evidence roles", async () => {
  const response = await render("/nutrition/supplement-evidence-and-safety");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /<title>How to evaluate supplement evidence and safety \| Joy Health<\/title>/i);
  assert.match(html, /<link rel="canonical" href="https:\/\/joyhealth\.cc\/nutrition\/supplement-evidence-and-safety"/i);
  assert.match(html, /<meta property="og:url" content="https:\/\/joyhealth\.cc\/nutrition\/supplement-evidence-and-safety"/i);
  assert.doesNotMatch(html, /(?:property="og:image"|name="twitter:image")/i);
  assert.match(html, /Published August 28, 2026/i);
  assert.match(html, /What this means/i);
  assert.match(html, /What the sources can tell us/i);
  assert.match(html, /How to use the framework/i);
  assert.match(html, /Limits and open questions/i);
  assert.match(html, /does not approve dietary supplements[\s\S]*before they are sold/i);
  assert.match(html, /A quality seal is not proof/i);
  assert.match(html, /Absence from the database is not evidence of safety/i);
  assert.match(html, /https:\/\/www\.ftc\.gov\/business-guidance\/resources\/health-products-compliance-guidance/i);
  assert.match(html, /https:\/\/ods\.od\.nih\.gov\/HealthInformation\/ODS_Frequently_Asked_Questions\//i);
  assert.doesNotMatch(html, /sissi\.usana\.com/i);
  assert.doesNotMatch(html, /—/);

  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  assert.ok(jsonLdMatch, "expected Article JSON-LD");
  const jsonLd = JSON.parse(jsonLdMatch[1]);
  assert.equal(jsonLd["@type"], "Article");
  assert.equal(jsonLd.headline, "How to evaluate supplement evidence and safety");
  assert.equal(jsonLd.mainEntityOfPage, "https://joyhealth.cc/nutrition/supplement-evidence-and-safety");
  assert.equal(jsonLd.datePublished, "2026-08-28");
  assert.equal(jsonLd.dateModified, undefined);
  assert.equal(jsonLd.image, undefined);
});

test("publishes a source-traced electrolyte guide that separates the label from the use case", async () => {
  const response = await render("/nutrition/electrolyte-drinks");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /<title>Electrolyte drinks: read the label, then match the context \| Joy Health<\/title>/i);
  assert.match(html, /<link rel="canonical" href="https:\/\/joyhealth\.cc\/nutrition\/electrolyte-drinks"/i);
  assert.match(html, /<meta property="og:url" content="https:\/\/joyhealth\.cc\/nutrition\/electrolyte-drinks"/i);
  assert.doesNotMatch(html, /(?:property="og:image"|name="twitter:image")/i);
  assert.match(html, /Published August 29, 2026/i);
  assert.match(html, /What this means/i);
  assert.match(html, /What the references can tell us/i);
  assert.match(html, /How to use the information/i);
  assert.match(html, /Limits and open questions/i);
  assert.match(html, /Contains electrolytes[\s\S]*names ingredients, not a need/i);
  assert.match(html, /universal replacement instructions impossible/i);
  assert.match(html, /https:\/\/www\.nata\.org\/sites\/default\/files\/2025-08\/fluid_replacement_for_the_physically_active\.pdf/i);
  assert.match(html, /https:\/\/ods\.od\.nih\.gov\/factsheets\/Potassium-HealthProfessional\//i);
  assert.match(html, /https:\/\/www\.fda\.gov\/food\/nutrition-facts-label\/how-understand-and-use-nutrition-facts-label/i);
  assert.doesNotMatch(html, /sissi\.usana\.com/i);
  assert.doesNotMatch(html, /—/);

  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  assert.ok(jsonLdMatch, "expected Article JSON-LD");
  const jsonLd = JSON.parse(jsonLdMatch[1]);
  assert.equal(jsonLd["@type"], "Article");
  assert.equal(jsonLd.headline, "Electrolyte drinks: read the label, then match the context");
  assert.equal(jsonLd.mainEntityOfPage, "https://joyhealth.cc/nutrition/electrolyte-drinks");
  assert.equal(jsonLd.datePublished, "2026-08-29");
  assert.equal(jsonLd.dateModified, undefined);
  assert.equal(jsonLd.image, undefined);
});

test("matches article breadcrumb data to the visible site hierarchy", async () => {
  const guides = [
    ["/nutrition/building-balanced-meals", "Balanced meals"],
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

test("publishes crawl controls and canonical URLs", async () => {
  const [robotsResponse, sitemapResponse] = await Promise.all([
    render("/robots.txt"),
    render("/sitemap.xml"),
  ]);

  assert.equal(robotsResponse.status, 200);
  assert.match(await robotsResponse.text(), /Sitemap: https:\/\/joyhealth\.cc\/sitemap\.xml/i);
  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  assert.match(sitemap, /<loc>https:\/\/joyhealth\.cc<\/loc>/i);
  assert.match(sitemap, /<loc>https:\/\/joyhealth\.cc\/standards<\/loc>/i);
  assert.match(sitemap, /<loc>https:\/\/joyhealth\.cc\/usana<\/loc>/i);
  assert.match(sitemap, /<loc>https:\/\/joyhealth\.cc\/nutrition<\/loc>/i);
  assert.match(
    sitemap,
    /<loc>https:\/\/joyhealth\.cc\/nutrition\/reading-food-labels<\/loc>/i,
  );
  assert.match(
    sitemap,
    /<loc>https:\/\/joyhealth\.cc\/nutrition\/building-balanced-meals<\/loc>/i,
  );
  assert.match(
    sitemap,
    /<loc>https:\/\/joyhealth\.cc\/nutrition\/protein-and-fiber<\/loc>/i,
  );
  assert.match(sitemap, /<loc>https:\/\/joyhealth\.cc\/nutrition\/carbohydrates-and-fats<\/loc>/i);
  assert.match(sitemap, /<loc>https:\/\/joyhealth\.cc\/nutrition\/hydration<\/loc>/i);
  assert.match(sitemap, /<loc>https:\/\/joyhealth\.cc\/nutrition\/supplement-evidence-and-safety<\/loc>/i);
  assert.match(sitemap, /<loc>https:\/\/joyhealth\.cc\/nutrition\/electrolyte-drinks<\/loc>/i);
  assert.doesNotMatch(sitemap, /priority|changefreq/i);
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

test("serves every full-resolution hero image referenced in rendered HTML", async () => {
  const homeResponse = await render("/");
  const html = await homeResponse.text();
  const heroImages = [
    "joy-health-morning.webp",
    "joy-health-balanced-meal.webp",
    "joy-health-garden-recovery.webp",
  ];

  for (const image of heroImages) {
    assert.match(
      html,
      new RegExp(`<img[^>]*src="/images/${image.replace(".", "\\.")}"[^>]*width="1672"[^>]*height="941"`, "i"),
    );
    assert.doesNotMatch(html, new RegExp(`/_next/image\\?[^"']*${image}`, "i"));

    const response = await worker.fetch(
      new Request(`https://joyhealth.cc/images/${image}`, {
        headers: { accept: "image/webp" },
      }),
      env,
      ctx,
    );

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("location"), null);
    assert.equal(response.headers.get("content-type"), "image/webp");
  }
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
  assert.match(await response.text(), /This page wandered off/i);
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
