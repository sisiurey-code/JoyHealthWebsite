/**
 * Tells IndexNow search engines (Bing, Yandex, Seznam, Naver, and others)
 * which URLs changed, so they recrawl them without waiting. Bing's index also
 * grounds Copilot and other assistants. Run after a deploy that went live:
 *
 *   npm run indexnow -- --since 2026-09-23          # preview the payload
 *   npm run indexnow -- --since 2026-09-23 --submit # send it
 *   npm run indexnow -- /usana /supplements/healthpak --submit
 *
 * `--since` selects sitemap entries whose lastmod is on or after the date,
 * read from the live sitemap. IndexNow asks for added, updated, or deleted
 * URLs only, so never resubmit the whole site for a cosmetic change.
 */
import { readdirSync, readFileSync } from "node:fs";

const SITE = "https://joyhealth.cc";
const ENDPOINT = "https://api.indexnow.org/indexnow";

const publicDir = new URL("../public/", import.meta.url);
const keyFiles = readdirSync(publicDir).filter((name) => /^[0-9a-f]{32}\.txt$/.test(name));
if (keyFiles.length !== 1) throw new Error(`Expected one IndexNow key file in public/, found ${keyFiles.length}`);
const key = readFileSync(new URL(keyFiles[0], publicDir), "utf8").trim();
if (`${key}.txt` !== keyFiles[0]) throw new Error("IndexNow key file content must equal its name");

const args = process.argv.slice(2);
const submit = args.includes("--submit");
const sinceIndex = args.indexOf("--since");
const since = sinceIndex >= 0 ? args[sinceIndex + 1] : undefined;
const paths = args.filter((arg, index) => arg.startsWith("/") && (sinceIndex < 0 || index !== sinceIndex + 1));

let urls = paths.map((path) => new URL(path, SITE).href);
if (since) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(since)) throw new Error(`--since needs YYYY-MM-DD, got ${since}`);
  const sitemap = await (await fetch(`${SITE}/sitemap.xml`)).text();
  const changed = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)]
    .filter(([, , lastModified]) => lastModified.slice(0, 10) >= since)
    .map(([, location]) => location);
  urls = [...new Set([...urls, ...changed])];
}
if (!urls.length) {
  console.error("Nothing to submit. Pass changed paths, or --since YYYY-MM-DD to read the live sitemap.");
  process.exit(1);
}

const keyLocation = `${SITE}/${key}.txt`;
const live = await fetch(keyLocation).then(async (response) => response.ok && (await response.text()).trim() === key, () => false);

const payload = { host: new URL(SITE).host, key, keyLocation, urlList: urls };
if (!submit) {
  console.log(JSON.stringify(payload, null, 2));
  console.log(`\nDry run: ${urls.length} URL(s). Key file ${live ? "is live" : "is NOT live yet (deploy first)"}. Add --submit to send.`);
  process.exit(0);
}
if (!live) throw new Error(`${keyLocation} is not live yet; deploy before submitting`);

const response = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
});
// 200 = accepted, 202 = accepted pending key check; 403 = key not verified, 422 = URL/host mismatch.
console.log(`IndexNow responded ${response.status} for ${urls.length} URL(s)`);
if (response.status !== 200 && response.status !== 202) process.exit(1);
