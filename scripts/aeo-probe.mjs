/**
 * Rough answerability check for assistants that retrieve passages. Splits
 * `dist/client/llms-full.txt` into heading-sized passages, ranks them with
 * BM25 for reader questions, and reports whether the top passage contains the
 * answer. A lexical proxy, not a model of any assistant: use it to catch
 * regressions in answer-first copy, not as a score to optimize. Run after
 * `npm run build`.
 */
import { readFileSync } from "node:fs";

const PROBES = [
  ["How much EPA and DHA is in USANA BiOmega?", /640 mg/],
  ["Does USANA MagneCal D have too much magnesium?", /520 mg[\s\S]*350 mg/],
  ["Is USANA CellSentials third-party tested or NSF certified?", /NSF[\s\S]*CellSentials/],
  ["What is in a USANA HealthPak packet?", /HealthPak packet lists|Alpha-Lipoic Acid \| 125 mg/],
  ["Can I take CellSentials and MagneCal D together?", /746 mg/],
  ["Is creatine bad for your kidneys?", /creatinine|harm to the kidneys/],
  ["Does creatine cause hair loss?", /DHT|hair/],
  ["How much creatine is in USANA Clear Protein + Creatine Mix?", /5 g/],
  ["How much water should I drink a day?", /3\.7 liters|2\.7 liters/],
  ["Are dietary supplements FDA approved?", /not approve/i],
  ["What are the ingredients in USANA Core Aminos?", /leucine/i],
  ["Does CoQ10 interact with warfarin?", /warfarin/],
  ["Should women take creatine?", /postmenopausal|women/i],
  ["How many CellSentials tablets a day?", /twice (a day|daily)/i],
  ["What does the 5% and 20% Daily Value rule mean?", /5%[\s\S]*20%/],
];

const STOP = new Set("a an the is are of in to for and or do does how what i can my me with on it be much many should you your this that".split(" "));
const tokens = (text) =>
  (text.toLowerCase().normalize("NFKD").match(/[a-z0-9µ]+/g) ?? [])
    .map((token) => (token.length > 4 && token.endsWith("s") && !token.endsWith("ss") ? token.slice(0, -1) : token));

export function passages(full) {
  const out = [];
  for (const page of full.split(/\n(?=---\ntitle: )/).filter((part) => part.startsWith("---\ntitle:"))) {
    const title = page.match(/title: "([^"]+)"/)[1];
    let heading = title;
    let lines = [];
    const flush = () => {
      const text = lines.join("\n").trim();
      if (text.length > 40) out.push({ heading, text: `${heading}\n${text}` });
      lines = [];
    };
    for (const line of page.replace(/^---[\s\S]*?\n---\n/, "").split("\n")) {
      if (/^#{1,3} /.test(line)) {
        flush();
        heading = `${title} › ${line.replace(/^#+ /, "").replace(/\s*\{#[^}]+\}$/, "")}`;
      } else lines.push(line);
    }
    flush();
  }
  return out;
}

export function rank(chunks, question) {
  const docs = chunks.map(({ text }) => tokens(text));
  const average = docs.reduce((sum, doc) => sum + doc.length, 0) / docs.length;
  const df = new Map();
  for (const doc of docs) for (const token of new Set(doc)) df.set(token, (df.get(token) ?? 0) + 1);
  const query = tokens(question).filter((token) => !STOP.has(token));
  return docs
    .map((doc, index) => {
      let score = 0;
      for (const token of query) {
        const frequency = doc.filter((term) => term === token).length;
        if (!frequency) continue;
        const idf = Math.log(1 + (docs.length - df.get(token) + 0.5) / (df.get(token) + 0.5));
        score += (idf * frequency * 2.2) / (frequency + 1.2 * (0.25 + (0.75 * doc.length) / average));
      }
      return { index, score };
    })
    .sort((left, right) => right.score - left.score);
}

const chunks = passages(readFileSync(new URL("../dist/client/llms-full.txt", import.meta.url), "utf8"));
let answered = 0;
for (const [question, answer] of PROBES) {
  const ranked = rank(chunks, question);
  const found = ranked.findIndex(({ index }) => answer.test(chunks[index].text)) + 1;
  if (found === 1) answered++;
  console.log(`${found === 1 ? "top " : `#${found || "-"}`.padEnd(4)}  ${question}\n      ${chunks[ranked[0].index].heading.slice(0, 110)}`);
}
console.log(`\n${answered}/${PROBES.length} questions answered by the top passage (${chunks.length} passages)`);
