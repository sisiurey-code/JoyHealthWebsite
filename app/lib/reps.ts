/**
 * The independent USANA representatives whose stores Joy Health links to.
 *
 * Every store link on the site points at `STORE_LINK_PATH`, or at
 * `STORE_LINK_PATH/<product>` for one product's store page. The Worker picks
 * the representative there: the one named by a personal link
 * (`?rep=<handle>` on any page or on the store link), else the one this
 * browser was already given, else one at random. The choice is remembered in
 * a first-party cookie that holds only the handle, so a visitor keeps one
 * representative from the first click to the checkout.
 *
 * To add a representative, add their handle here. The handle is the first
 * label of their USANA store address (`<handle>.usana.com`). USANA serves the
 * same page for any handle, so open the address in a browser and confirm the
 * representative's name appears before adding it.
 */
export const REP_HANDLES = ["sissi", "brand"] as const;

export type RepHandle = (typeof REP_HANDLES)[number];

/** First-party path that redirects to a representative's store. */
export const STORE_LINK_PATH = "/go/usana";

/** Store links are compensated, and crawlers have no reason to follow them. */
export const STORE_LINK_REL = "sponsored nofollow";

/** Query parameter of a personal link, for example `/?rep=sissi`. */
export const REP_PARAM = "rep";

/** Cookie holding the visitor's representative handle and nothing else. */
export const REP_COOKIE = "jh_rep";

export const REP_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export function parseRepHandle(value: string | null | undefined): RepHandle | undefined {
  const handle = value?.trim().toLowerCase();
  return REP_HANDLES.find((known) => known === handle);
}

export function repFromCookieHeader(header: string | null | undefined): RepHandle | undefined {
  for (const part of (header ?? "").split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0 || part.slice(0, separator).trim() !== REP_COOKIE) continue;
    return parseRepHandle(part.slice(separator + 1));
  }
  return undefined;
}

/**
 * USANA item numbers for the products that have a page here, keyed by the last
 * segment of the page's path. Read from USANA's U.S. catalog
 * (`https://api.usana.com/cart/productGroup/`) on November 14, 2026. Clear
 * Protein + Creatine is the green apple 20-serving bag, the one pictured.
 */
export const STORE_ITEM_NUMBERS: Readonly<Record<string, string>> = {
  cellsentials: "101.010104",
  healthpak: "100.010105",
  procosa: "131.010104",
  biomega: "122.010104",
  "magnecal-d": "120.010103",
  "coquinone-30": "123.010102",
  "clear-protein-creatine": "250.010100",
  "core-aminos": "179.010100",
};

/** Store link for the product whose page is at `pagePath`. */
export function productStoreLinkPath(pagePath: string): string {
  const slug = pagePath.slice(pagePath.lastIndexOf("/") + 1);
  if (!Object.hasOwn(STORE_ITEM_NUMBERS, slug)) throw new Error(`No store item number for ${pagePath}`);
  return `${STORE_LINK_PATH}/${slug}`;
}

export const repStoreHost = (handle: RepHandle) => `${handle}.usana.com`;

/**
 * The representative's own store address: its front page, or one product's
 * page when `slug` names one. USANA forwards the address to its shop, keeping
 * the path and crediting the representative. Product addresses use the item
 * number with dashes.
 */
export function repStoreUrl(handle: RepHandle, slug?: string): string {
  const item = slug && Object.hasOwn(STORE_ITEM_NUMBERS, slug) ? STORE_ITEM_NUMBERS[slug] : undefined;
  const page = item ? `ux/cart/en-US/product/${item.replaceAll(".", "-")}` : "";
  return `https://${repStoreHost(handle)}/${page}`;
}
