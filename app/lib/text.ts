const SMALL_NUMBER_WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
] as const;

/**
 * Spells out small counts so copy such as "Seven practical guides" stays
 * correct as the underlying lists change. Larger counts fall back to digits.
 */
export function countWord(count: number, options?: { capitalize?: boolean }) {
  const word = SMALL_NUMBER_WORDS[count] ?? String(count);
  return options?.capitalize ? word.charAt(0).toUpperCase() + word.slice(1) : word;
}
