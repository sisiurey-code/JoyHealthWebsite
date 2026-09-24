# Supplement label transcriptions

`app/lib/supplement-labels.ts` holds each product's label as text. The
`/supplements/*` pages, the daily-amount tables, the `/usana` overlap table,
each product page's structured data, and the downloadable
`/data/supplement-labels.json` and `.csv` are all computed from it, so a wrong
row there is wrong everywhere. This file
records how the rows were checked and what to redo when a label changes.

## How the September 23, 2026 transcription was checked

1. Every row was read from the label photos in `public/images/usana/`,
   enlarged until each cell was unambiguous.
2. Each printed %DV was recomputed against FDA's current Daily Values
   (21 CFR 101.9(c)(8)(iv) and (c)(9)); 66 of 70 checks matched, and the four
   that did not are label-side issues listed below.
3. Each product was compared with the current U.S. label PDF that USANA
   publishes. USANA's product pages load their content from
   `https://api.usana.com/cart/productGroup/byProduct/<item number>`; that
   response carries the "How to Use" text and a `supplementalInfo` link that
   redirects to the label PDF on `www.usana.com/content/`. The PDF URLs are in
   `labelSource` for each product.
4. Daily amounts use the printed directions. NSF's listing
   (`https://info.nsf.org/Certified/Dietary/Listings.asp?CompanyName=usana&StandardExt=FP`)
   gives the same recommended daily serving for every product it lists.

## Discrepancies found

| Product | Finding | What the site does |
| --- | --- | --- |
| HealthPak | Until September 24, 2026, the label photo (`healthpak-label.png`, item 100.010104) showed the previous formula; it was replaced with the current label that day. The current label (100.010105) has alpha-lipoic acid 125 mg (was 63), quercetin 90 mg (was 78), Meriva 36 mg (was 58), no astaxanthin, and adds Pterocarpus marsupium extract 50 mg. Vitamins, minerals, and directions are unchanged. | The product page and the `/usana` card show the current label photo, checked row by row against this transcription; the product page describes the formula change. |
| CellSentials | The earlier label photo showed a "CONTAINS SOY" badge; the current label has no soy statement and uses sunflower lecithin. The photo was replaced on September 24, 2026 with the current Vita Antioxidant and Core Minerals labels, checked row by row against this transcription. | The product page says so. |
| MagneCal D | The printed label says two tablets twice daily (NSF agrees: 4 tablets). USANA's product page says "two (2) tablets a day." | The site uses the printed label and states the conflict. |
| Core Aminos | Calcium 290 mg is printed as 29% DV; against the current 1,300 mg DV it is 22%. 1,500 mg of calcium HMB supplies roughly 200 mg of calcium (NIH: about 13% by weight), and no other calcium source is listed. Total carbohydrate 2 g is printed "<1%" where FDA rounding gives 1%. | The product page reports the %DV and calcium questions; the carbohydrate rounding is not mentioned. |
| Clear Protein + Creatine Mix | USANA has not published this label. It is a Nutrition Facts panel (food format), and it names creatine only in the ingredient list, with no amount; the 5 g figure is from USANA's launch announcement. The calcium (12%) and iron (1%) percentages do not follow FDA's Nutrition Facts rounding increments. | Rows come from the photo only. No directions are stated, so the page shows per-serving amounts. |
| CoQuinone 30 | The label USANA links (item 123.010101) is older than the item it sells (123.010102). | The product page notes that a newer printed label may exist. |

## When a label changes

1. Download the current label PDF through the product data URL above and
   compare it row by row with `PRODUCT_LABELS`.
2. Update the rows, `directions`, `servingsPerDay`, and `labelSource`; set
   `LABEL_TRANSCRIBED_ON` to the date of the check.
3. Re-read the NSF listing; update `NSF_LISTING` in
   `app/lib/supplement-sources.ts` and any page that names listed products.
4. Run `npm run check`. The rendered tests pin several label values and the
   rows flagged above an upper limit; update them only after confirming the
   new label.
5. If a change alters what a page tells readers (for example, a nutrient
   crossing an upper limit), treat it as a substantive update under the
   editorial standards and note what changed.

Upper limits live in `app/lib/nutrient-limits.ts` with what each one counts
(several apply to supplements only). They come from the National Academies as
reported by the NIH Office of Dietary Supplements and were read on
September 23, 2026.
