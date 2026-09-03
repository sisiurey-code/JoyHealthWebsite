"use client";

import { useState, type PointerEvent, type ReactNode } from "react";
import {
  responsiveProductSources,
  USANA_PRODUCT_IMAGES,
  type ProductImage,
} from "../lib/usana";

type ProductCardProps = Readonly<{
  name: string;
  title?: ReactNode;
  label: string;
  product: ProductImage;
  facts: ProductImage;
  children: ReactNode;
  fit?: ReactNode;
  featured?: boolean;
  editorPick?: boolean;
  compactTitle?: boolean;
}>;

const cardImageSizes =
  "(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 400px";
const featuredImageSizes = "(max-width: 760px) 100vw, 480px";

function ProductPhoto({
  image,
  sizes = cardImageSizes,
}: Readonly<{ image: ProductImage; sizes?: string }>) {
  return (
    <figure className="usana-product-figure">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        srcSet={responsiveProductSources(image)}
        sizes={sizes}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading="lazy"
        decoding="async"
      />
    </figure>
  );
}

function LabelPhoto({
  image,
  name,
  sizes = cardImageSizes,
}: Readonly<{ image: ProductImage; name: string; sizes?: string }>) {
  function setMagnifierOrigin(event: PointerEvent<HTMLAnchorElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    event.currentTarget.style.setProperty("--zoom-x", `${x}%`);
    event.currentTarget.style.setProperty("--zoom-y", `${y}%`);
  }

  return (
    <figure className="usana-label-figure">
      <a
        href={image.src}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open the full-size Supplement Facts label for ${name}`}
        onPointerMove={setMagnifierOrigin}
      >
        {/* The native-resolution file also opens directly for close inspection. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.src}
          srcSet={responsiveProductSources(image)}
          sizes={sizes}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
        />
      </a>
      <figcaption>
        <span className="usana-label-hint-hover">Hover to magnify · </span>
        Select for full size
      </figcaption>
    </figure>
  );
}

function ProductCard({
  name,
  title,
  label,
  product,
  facts,
  children,
  fit,
  featured = false,
  editorPick = false,
  compactTitle = false,
}: ProductCardProps) {
  const [showLabel, setShowLabel] = useState(false);
  const sizes = featured ? featuredImageSizes : cardImageSizes;

  function toggle() {
    setShowLabel((current) => !current);
  }

  const className = [
    "usana-product-card",
    featured ? "is-featured" : "",
    editorPick ? "is-editor-pick" : "",
    compactTitle ? "has-compact-title" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    // The labeled toggle button is the keyboard equivalent; the article click
    // handler makes the remaining card surface a convenient pointer target.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <article
      className={className}
      data-state={showLabel ? "label" : "overview"}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("a, button")) return;
        toggle();
      }}
    >
      <div
        className={`usana-product-face usana-product-overview${showLabel ? "" : " is-active"}`}
        aria-hidden={showLabel}
      >
        <ProductPhoto image={product} sizes={sizes} />
        <div className="usana-product-details">
          <p className="usana-product-label">{label}</p>
          <h3>{title ?? name}</h3>
          <div className="usana-product-copy">{children}</div>
          {fit ? <p className="usana-product-fit">{fit}</p> : null}
        </div>
      </div>

      <div
        className={`usana-product-face usana-product-media${showLabel ? " is-active" : ""}`}
        aria-hidden={!showLabel}
      >
        <LabelPhoto image={facts} name={name} sizes={sizes} />
      </div>

      <button
        className="usana-product-state-control"
        type="button"
        onClick={toggle}
        aria-pressed={showLabel}
        aria-label={
          showLabel
            ? `Showing the Supplement Facts label for ${name}. Show the overview.`
            : `Showing the overview for ${name}. Show the Supplement Facts label.`
        }
      >
        <span>{showLabel ? "Overview" : "Supplement Facts"}</span>
        <span className="usana-product-state-icon" aria-hidden="true">
          {showLabel ? "←" : "→"}
        </span>
      </button>
    </article>
  );
}

const products = USANA_PRODUCT_IMAGES;

export function UsanaProductCards() {
  return (
    <div className="usana-product-grid">
      <ProductCard
        name="CellSentials"
        label="Flagship foundation"
        featured
        {...products.cellsentials}
        fit={
          <>
            Compare the two-bottle routine and ingredient overlap before
            adding narrower formulas.
          </>
        }
      >
        <p>
          Core Minerals and Vita-Antioxidant form the flagship daily
          nutrition system. USANA&apos;s 2026 filing identifies
          Essentials/CellSentials as a key product, and the company reports a
          2026 ConsumerLab seal for label accuracy, purity, and potency.
          <a className="citation" href="#usana-source-7" aria-label="Source 7">[7]</a>
          <a className="citation" href="#usana-source-8" aria-label="Source 8">[8]</a>
        </p>
      </ProductCard>

      <ProductCard
        name="HealthPak"
        label="Flagship convenience"
        featured
        {...products.healthpak}
        fit={
          <>
            HealthPak reduces daily sorting; CellSentials alone leaves more
            room to add selectively.
          </>
        }
      >
        <p>
          HealthPak packages CellSentials with MagneCal D and the CellSentials
          Booster in daily packets. It trades flexibility for the convenience
          of a wider preset stack.
          <a className="citation" href="#usana-source-10" aria-label="Source 10">[10]</a>
        </p>
      </ProductCard>

      <ProductCard name="Procosa" label="Focused formula" {...products.procosa}>
        <p>
          A targeted combination built around vegetarian glucosamine, vitamin
          C, and curcumin. Read the exact serving and other ingredients before
          comparing it with single-ingredient options.
          <a className="citation" href="#usana-source-10" aria-label="Source 10">[10]</a>
        </p>
      </ProductCard>

      <ProductCard name="BiOmega" label="Omega-3 format" {...products.biomega}>
        <p>
          A fish-oil product providing concentrated omega-3 fatty acids plus
          vitamin D. It is also one of the finished products named in the
          current NSF listing, which applies to that product and scope.
          <a className="citation" href="#usana-source-2" aria-label="Source 2">[2]</a>
          <a className="citation" href="#usana-source-10" aria-label="Source 10">[10]</a>
        </p>
      </ProductCard>

      <ProductCard name="MagneCal D" label="Mineral combination" {...products.magnecal}>
        <p>
          Calcium, magnesium, vitamin D, and boron share one formula. USANA
          reports that ConsumerLab testing found the claimed amounts and
          checked purity, label accuracy, and disintegration.
          <a className="citation" href="#usana-source-9" aria-label="Source 9">[9]</a>
        </p>
      </ProductCard>

      <ProductCard
        name="CoQuinone"
        label="Joy Health pick"
        editorPick
        {...products.coquinone}
        fit={
          <>
            Its short label makes ingredient overlap and exclusions easier to
            spot.
          </>
        }
      >
        <p>
          The U.S. CoQuinone 30 label is short: coenzyme Q10 and alpha-lipoic
          acid. It also identifies soy and gelatin, with no established Daily
          Value for either active ingredient.
          <a className="citation" href="#usana-source-11" aria-label="Source 11">[11]</a>
        </p>
      </ProductCard>

      <ProductCard
        name="Clear Protein + Creatine"
        title={
          <>
            <span className="usana-title-lock">Clear Protein</span> + Creatine
          </>
        }
        label="Joy Health pick"
        editorPick
        compactTitle
        {...products.clearProtein}
        fit={
          <>
            It saves real shelf space when all three ingredients already
            belong in the routine.
          </>
        }
      >
        <p>
          One 50-calorie serving combines 10 grams of clear whey protein
          isolate, 5 grams of creatine monohydrate, and more than 600
          milligrams of electrolytes. It comes in Twisted Citrus and Green
          Apple, in bags or single-serve packets.
          <a className="citation" href="#usana-source-12" aria-label="Source 12">[12]</a>
        </p>
      </ProductCard>

      <ProductCard
        name="Core Aminos"
        title={<span className="usana-title-lock">Core Aminos</span>}
        label="Joy Health pick"
        editorPick
        compactTitle
        {...products.coreAminos}
        fit={
          <>
            Check whether both parts of the formula fit the intended routine,
            then compare the serving with simpler amino-acid products.
          </>
        }
      >
        <p>
          Core Aminos is a lemonade-flavored drink mix combining essential
          amino acids with HMB. USANA introduced it in 2025 as part of its
          active-nutrition expansion.
          <a className="citation" href="#usana-source-4" aria-label="Source 4">[4]</a>
        </p>
      </ProductCard>
    </div>
  );
}
