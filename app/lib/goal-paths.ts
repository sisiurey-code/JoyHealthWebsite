import { getGuide } from "./publications";
import { getSupplement } from "./supplements";

export type GoalLink = Readonly<{ href: string; title: string }>;

/**
 * One home-page starting point. Paths are organized by what a reader wants,
 * never by symptom, so they stay general education rather than triage. Each
 * answer restates findings from the pages it links, which carry the sources;
 * a path must not make a claim those pages do not, and Joy Health
 * interpretation stays labeled as ours.
 */
export type GoalPath = Readonly<{
  id: string;
  /** Completes the sentence "I want to …". */
  verb: string;
  /** Reader question; the path's heading. */
  question: string;
  answer: string;
  tryThis: string;
  read: readonly GoalLink[];
  look: GoalLink & Readonly<{ note: string; kind: "product" | "tool" }>;
  icon: "plate" | "dumbbell" | "puzzle" | "label";
  tone: "sage" | "apricot" | "citrus" | "sky";
}>;

const guide = (key: Parameters<typeof getGuide>[0]): GoalLink => {
  const { path, title } = getGuide(key);
  return { href: path, title };
};

const product = (key: Parameters<typeof getSupplement>[0]): GoalLink => {
  const { path, name } = getSupplement(key);
  return { href: path, title: name };
};

export const GOAL_PATHS: readonly GoalPath[] = [
  {
    id: "eat-better",
    verb: "eat a bit better",
    question: "Where do I start if I want to eat better?",
    // Building balanced meals, "How to build a balanced meal in four steps".
    answer:
      "With a meal you already eat. Name what is in it and look for more than one kind of food. Our suggestion, not a clinical rule: if one easy addition fits how you eat and what you can get, make it, and if the meal already works, leave it alone.",
    tryThis: "At one meal a day, name what is on the plate before changing anything.",
    read: [guide("building-balanced-meals"), guide("protein-and-fiber")],
    look: {
      ...product("cellsentials"),
      note: "The daily multivitamin and mineral: its full label as text, and what a day of it adds up to.",
      kind: "product",
    },
    icon: "plate",
    tone: "sage",
  },
  {
    id: "workouts",
    verb: "get more from my workouts",
    question: "Does any supplement help with strength training?",
    // Creatine guide, opening summary.
    answer:
      "In the trials we reviewed, creatine monohydrate has a steady safety record in healthy adults, the longest about two years, and its best-supported benefit is modest: a little more strength gain when it is paired with resistance training, including for older adults. The guide lays out the evidence; it does not tell you whether to take it.",
    tryThis:
      "Choose strength exercises you will actually repeat. In the trials, the benefit came with the training, not instead of it.",
    read: [guide("creatine"), guide("protein-and-fiber")],
    look: {
      ...product("clearProtein"),
      note: "10 g of protein per serving, and USANA says 5 g of creatine. The panel as text, and what it leaves out.",
      kind: "product",
    },
    icon: "dumbbell",
    tone: "apricot",
  },
  {
    id: "fill-gaps",
    verb: "cover gaps in my diet",
    question: "How do I choose a supplement without doubling up?",
    // Supplement evidence guide, opening summary; the /usana stack builder's findings.
    answer:
      "FDA does not approve supplements before they are sold, so the label, the marketing claim, the research, and your own safety each need their own check. Then add up what you already take: some of the products on this site repeat the same nutrients, and together they can pass an adult upper limit.",
    tryThis:
      "Write down everything you take, with its label. If any of it is on this site, add those products up in the stack builder.",
    read: [guide("supplement-evidence-and-safety")],
    look: {
      href: "/usana#stack",
      title: "The stack builder",
      note: "Pick products and see their daily totals against adult upper limits.",
      kind: "tool",
    },
    icon: "puzzle",
    tone: "citrus",
  },
  {
    id: "labels",
    verb: "understand food labels",
    question: "What should I read first on a Nutrition Facts label?",
    // Reading food labels, "Find the serving basis", "Make the comparison fair", and %DV.
    answer:
      "The serving size and the servings per container, before any other number. When comparing two foods, first check whether their serving sizes match. Then read each amount with its %DV: FDA's general guide calls 5% DV or less low and 20% DV or more high for a nutrient per serving.",
    tryThis: "Compare two foods you already buy, serving size first.",
    read: [guide("reading-food-labels"), guide("carbohydrates-and-fats")],
    look: {
      ...product("biomega"),
      note: "Practice on a Supplement Facts panel: every row as text, with what it does and does not tell you.",
      kind: "product",
    },
    icon: "label",
    tone: "sky",
  },
];
