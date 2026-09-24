/**
 * Writes the machine-readable mirrors of the built site for AI agents and
 * answer engines: a Markdown twin of every sitemap page, `/llms.txt`, and
 * `/llms-full.txt`. It runs after `vinext build` and renders through the built
 * Worker, so the Markdown always matches the prerendered HTML it mirrors.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const SITE = "https://joyhealth.cc";
const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
const SKIP = new Set(["script", "style", "template", "noscript", "button", "svg", "form", "input", "select", "textarea", "iframe"]);
const BLOCK = new Set(["address", "article", "aside", "blockquote", "details", "div", "dl", "fieldset", "figcaption", "figure", "footer", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "li", "main", "nav", "ol", "p", "section", "summary", "table", "ul"]);

const decode = (text) => text.replace(/&(?:#x([\da-f]+)|#(\d+)|(amp|lt|gt|quot|apos|nbsp));/gi, (_, hex, dec, name) => {
  if (hex) return String.fromCodePoint(Number.parseInt(hex, 16));
  if (dec) return String.fromCodePoint(Number(dec));
  return { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " }[name.toLowerCase()];
});

function attributes(source) {
  return Object.fromEntries(
    [...source.matchAll(/([^\s=/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)]
      .map(([, key, double, single, bare]) => [key.toLowerCase(), decode(double ?? single ?? bare ?? "")]),
  );
}

/** Minimal tree builder for the well-formed HTML that React prerenders. */
export function parseHtml(html) {
  const root = { tag: "#root", attrs: {}, children: [] };
  const stack = [root];
  // Raw-text elements are dropped before tokenizing; none of them is content.
  const markup = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
  for (const [token, comment, closing, tag, attrs] of markup.matchAll(/<!--([\s\S]*?)-->|<(\/?)([a-zA-Z][\w-]*)([^>]*)>|[^<]+|</g)) {
    const parent = stack.at(-1);
    if (comment !== undefined) continue;
    if (!tag) {
      parent.children.push({ text: decode(token) });
      continue;
    }
    const name = tag.toLowerCase();
    if (closing) {
      const index = stack.findLastIndex((node) => node.tag === name);
      if (index > 0) stack.length = index;
      continue;
    }
    const node = { tag: name, attrs: attributes(attrs), children: [] };
    parent.children.push(node);
    if (!VOID.has(name) && !attrs.trimEnd().endsWith("/")) stack.push(node);
  }
  return root;
}

function find(node, predicate) {
  if (predicate(node)) return node;
  for (const child of node.children ?? []) {
    const match = find(child, predicate);
    if (match) return match;
  }
  return undefined;
}

const textOf = (node) => (node.text ?? (node.children ?? []).map(textOf).join(""));
const escapeText = (text) => text.replace(/([\\`*_])/g, "\\$1");

function isSkipped(node) {
  if (!node.tag) return false;
  if (SKIP.has(node.tag) || node.attrs["aria-hidden"] === "true" || "hidden" in node.attrs) return true;
  if (node.tag === "nav") {
    // In-page contents and breadcrumbs are navigation chrome, not content.
    const links = [];
    const collect = (child) => {
      if (child.tag === "a") links.push(child.attrs.href ?? "");
      child.children?.forEach(collect);
    };
    collect(node);
    return node.attrs["aria-label"] === "Breadcrumb" || links.every((href) => href.startsWith("#"));
  }
  return false;
}

/**
 * Joins inline siblings. Adjacent elements with no text between them (such as
 * a row of links laid out by CSS) get a space so their words do not run
 * together; citation superscripts stay attached.
 */
function joinInline(children, base) {
  let out = "";
  let previous;
  for (const child of children) {
    const rendered = inline(child, base);
    if (!rendered) continue;
    if (previous?.tag && child.tag && previous.tag !== "sup" && child.tag !== "sup" && !/\s$/.test(out) && !/^\s/.test(rendered)) out += " ";
    out += rendered;
    previous = child;
  }
  return out;
}

/** Renders inline content (text, links, emphasis) to a single Markdown line. */
function inline(node, base) {
  if (node.text !== undefined) return escapeText(node.text.replace(/\s+/g, " "));
  if (isSkipped(node)) return "";
  const inner = () => joinInline(node.children, base);
  switch (node.tag) {
    case "br":
      return "\n";
    case "img":
      // Photos are presentation; their alt text restates nearby headings.
      return "";
    case "strong":
    case "b": {
      const content = inner().trim();
      return content ? `**${content}**` : "";
    }
    case "em":
    case "i": {
      const content = inner().trim();
      return content ? `*${content}*` : "";
    }
    case "code":
      return `\`${textOf(node)}\``;
    case "a": {
      const content = inner().trim();
      const href = node.attrs.href;
      // Numbered citations stay as plain "[n]" markers beside the source list.
      if (!content || !href || /^\\?\[\d+\\?\]$/.test(content)) return content;
      return `[${content}](${new URL(href, base).href})`;
    }
    default:
      return inner();
  }
}

const tidy = (text) => text.replace(/[ \t]+\n/g, "\n").replace(/\n[ \t]+/g, "\n").replace(/[ \t]{2,}/g, " ").trim();
const indent = (text, prefix) => text.split("\n").map((line) => (line ? prefix + line : line)).join("\n");
const hasBlockChild = (node) => node.children.some((child) => child.tag && (BLOCK.has(child.tag) || hasBlockChild(child)));

/** Renders block content to Markdown paragraphs separated by blank lines. */
function blocks(node, base) {
  const out = [];
  let run = [];
  const flush = () => {
    const text = tidy(joinInline(run, base));
    if (text) out.push(text);
    run = [];
  };
  for (const child of node.children) {
    if (isSkipped(child)) continue;
    if (child.text !== undefined || !BLOCK.has(child.tag)) {
      run.push(child);
      continue;
    }
    flush();
    const rendered = block(child, base);
    if (rendered) out.push(rendered);
  }
  flush();
  return out.join("\n\n");
}

function listItems(node, base, ordered) {
  let number = Number(node.attrs.start ?? 1);
  return node.children
    .filter((child) => child.tag === "li" && !isSkipped(child))
    .map((item) => {
      const marker = ordered ? `${number++}. ` : "- ";
      // Headings inside list items (step titles, card titles) become bold text.
      const body = (hasBlockChild(item) ? blocks(item, base) : tidy(inline(item, base)))
        .replace(/^#{1,6} (.+)$/gm, "**$1**");
      const [first, ...rest] = body.split("\n");
      return marker + first + (rest.length ? "\n" + indent(rest.join("\n"), " ".repeat(marker.length)) : "");
    })
    .join("\n");
}

function table(node, base) {
  const rows = [];
  const walk = (child) => {
    if (child.tag === "tr") rows.push(child.children.filter((cell) => cell.tag === "th" || cell.tag === "td"));
    else child.children?.forEach(walk);
  };
  walk(node);
  if (!rows.length) return "";
  const cell = (item) => tidy(inline(item, base)).replace(/\n/g, " ").replace(/\|/g, "\\|");
  const lines = rows.map((row) => `| ${row.map(cell).join(" | ")} |`);
  lines.splice(1, 0, `| ${rows[0].map(() => "---").join(" | ")} |`);
  const caption = node.children.find((child) => child.tag === "caption");
  return (caption ? `**${tidy(inline(caption, base))}**\n\n` : "") + lines.join("\n");
}

function block(node, base) {
  switch (node.tag) {
    case "h1": case "h2": case "h3": case "h4": case "h5": case "h6": {
      // A heading attribute ({#id}, as in Pandoc and kramdown) keeps the HTML
      // fragment, so an agent can cite canonical_url#id for one section.
      const id = node.attrs.id;
      return `${"#".repeat(Number(node.tag[1]))} ${tidy(inline(node, base)).replace(/\s*\n\s*/g, " ")}${id ? ` {#${id}}` : ""}`;
    }
    case "p":
    case "figcaption":
      return tidy(inline(node, base));
    case "summary":
      return `**${tidy(inline(node, base))}**`;
    case "ul":
      return listItems(node, base, false);
    case "ol":
      return listItems(node, base, true);
    case "dl":
      return node.children
        .flatMap((child) => (child.tag === "div" ? child.children : [child]))
        .reduce((items, child) => {
          if (child.tag === "dt") items.push({ term: tidy(inline(child, base)), details: [] });
          else if (child.tag === "dd" && items.length) items.at(-1).details.push(tidy(inline(child, base)));
          return items;
        }, [])
        .map(({ term, details }) => `- **${term}** — ${details.join(" ")}`)
        .join("\n");
    case "table":
      return table(node, base);
    case "aside":
    case "blockquote":
      return indent(blocks(node, base), "> ").replace(/^$/gm, ">");
    case "hr":
      return "---";
    case "li":
      return blocks(node, base);
    default:
      return blocks(node, base);
  }
}

function headMetadata(document) {
  const head = find(document, (node) => node.tag === "head");
  const tags = [];
  const collect = (node) => {
    if (node.tag === "meta" || node.tag === "link" || node.tag === "title") tags.push(node);
    node.children?.forEach(collect);
  };
  collect(head);
  const meta = (key) => tags.find((tag) => tag.tag === "meta" && (tag.attrs.name === key || tag.attrs.property === key))?.attrs.content;
  return {
    title: textOf(tags.find((tag) => tag.tag === "title") ?? { children: [] }).trim(),
    description: meta("description"),
    canonical: tags.find((tag) => tag.tag === "link" && tag.attrs.rel === "canonical")?.attrs.href,
    published: meta("article:published_time"),
    modified: meta("article:modified_time"),
  };
}

const yamlString = (value) => JSON.stringify(value);

/** Converts one prerendered page to Markdown with a small metadata header. */
export function pageToMarkdown(html, { lastModified } = {}) {
  const document = parseHtml(html);
  const metadata = headMetadata(document);
  const main = find(document, (node) => node.tag === "main");
  if (!main || !metadata.canonical) throw new Error("Page is missing <main> or a canonical URL");
  const updated = metadata.modified ?? (metadata.published ? undefined : lastModified);
  const header = [
    "---",
    `title: ${yamlString(metadata.title)}`,
    `description: ${yamlString(metadata.description ?? "")}`,
    `canonical_url: ${new URL(metadata.canonical).href}`,
    ...(metadata.published ? [`published: ${metadata.published}`] : []),
    ...(updated ? [`updated: ${updated}`] : []),
    "publisher: Joy Health",
    "---",
  ].join("\n");
  const body = blocks(main, metadata.canonical).replace(/\n{3,}/g, "\n\n");
  return { metadata, markdown: `${header}\n\n${body}\n` };
}

/** Public Markdown path for a canonical page path. */
export function markdownPath(pathname) {
  return pathname === "/" ? "/index.md" : `${pathname}.md`;
}

function sectionFor(pathname) {
  if (pathname === "/nutrition" || pathname.startsWith("/nutrition/")) return "Nutrition guides";
  if (pathname.startsWith("/supplements/") || pathname === "/usana") return "Supplements and product labels";
  return "About Joy Health";
}

export function buildLlmsTxt(pages) {
  const home = pages.find(({ pathname }) => pathname === "/");
  const sections = new Map();
  for (const page of pages) {
    if (page.pathname === "/") continue;
    const name = sectionFor(page.pathname);
    if (!sections.has(name)) sections.set(name, []);
    sections.get(name).push(page);
  }
  const order = ["Nutrition guides", "Supplements and product labels", "About Joy Health"];
  const title = (page) => page.metadata.title.replace(/ \| Joy Health$/, "");
  return [
    "# Joy Health",
    "",
    `> ${home.metadata.description}`,
    "",
    "Joy Health publishes general nutrition education, not individualized medical advice, diagnosis, or treatment. Every guide lists the sources it read, separates source findings from Joy Health interpretation, and states its limits. Supplement pages compare products by their Supplement Facts labels; links to the storefront are affiliate links, disclosed next to each link.",
    "",
    `Every page below is also available as Markdown: append \`.md\` to its path (the home page is ${SITE}/index.md) or request it with \`Accept: text/markdown\`. When citing, please link the canonical page URL listed here. Headings in the Markdown end with \`{#id}\`; to cite one section, link the canonical URL with that fragment, such as ${SITE}/supplements/magnecal-d#daily-title.`,
    "",
    ...order.flatMap((name) => [
      `## ${name}`,
      "",
      ...(sections.get(name) ?? []).map((page) => `- [${title(page)}](${new URL(page.metadata.canonical).href}): ${page.metadata.description}`),
      "",
    ]),
    "## Data",
    "",
    `- [Supplement label data (JSON)](${SITE}/data/supplement-labels.json): every transcribed label row for the products above, with daily amounts at the label directions and adult upper limits, generated from the same records as the pages; licensed CC BY 4.0 (credit Joy Health with a link to ${SITE}/usana#label-data)`,
    `- [Supplement label rows (CSV)](${SITE}/data/supplement-labels.csv): one line per printed label row`,
    "",
    "## Optional",
    "",
    `- [Full text of every page](${SITE}/llms-full.txt): all pages above as one Markdown document`,
    `- [Home page](${SITE}/): ${title(home)}`,
    `- [Sitemap](${SITE}/sitemap.xml)`,
    "",
  ].join("\n");
}

export function buildLlmsFullTxt(pages) {
  return [
    "# Joy Health: full text",
    "",
    "> Every public Joy Health page as Markdown, in sitemap order. General education, not medical advice. Cite the canonical_url of each page, adding a heading's {#id} as the fragment to cite one section.",
    "",
    ...pages.map(({ markdown }) => markdown.trim()),
  ].join("\n\n") + "\n";
}

async function loadWorker(distUrl) {
  const workerUrl = new URL("server/index.js", distUrl);
  workerUrl.searchParams.set("agent-files", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const env = {
    ASSETS: {
      fetch: async (request) => {
        try {
          return new Response(await readFile(new URL(`client${new URL(request.url).pathname}`, distUrl)));
        } catch {
          return new Response("Not found", { status: 404 });
        }
      },
    },
  };
  const ctx = { waitUntil() {}, passThroughOnException() {} };
  return (pathname) => worker.fetch(new Request(new URL(pathname, SITE), { headers: { accept: "text/html" } }), env, ctx);
}

export async function buildAgentFiles(distUrl = new URL("../dist/", import.meta.url)) {
  const request = await loadWorker(distUrl);
  const sitemap = await (await request("/sitemap.xml")).text();
  const entries = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>\s*(?:<lastmod>([^<]+)<\/lastmod>)?/g)]
    .map(([, location, lastModified]) => ({ pathname: new URL(location).pathname, lastModified }));
  if (!entries.length) throw new Error("Sitemap has no entries");
  const pages = [];
  for (const { pathname, lastModified } of entries) {
    const response = await request(pathname);
    if (response.status !== 200) throw new Error(`${pathname} returned ${response.status}`);
    const page = pageToMarkdown(await response.text(), { lastModified });
    if (new URL(page.metadata.canonical).href !== new URL(pathname, SITE).href) throw new Error(`Canonical mismatch: ${pathname}`);
    const file = new URL(`client${markdownPath(pathname)}`, distUrl);
    await mkdir(new URL(".", file), { recursive: true });
    await writeFile(file, page.markdown);
    pages.push({ pathname, ...page });
  }
  await writeFile(new URL("client/llms.txt", distUrl), buildLlmsTxt(pages));
  await writeFile(new URL("client/llms-full.txt", distUrl), buildLlmsFullTxt(pages));
  return pages.length;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const count = await buildAgentFiles();
  console.log(`Wrote ${count} Markdown pages, llms.txt, and llms-full.txt`);
}
