"use client";

import { useState, type PointerEvent, type ReactNode } from "react";

type ProductImage = Readonly<{
  src: string;
  alt: string;
  width: number;
  height: number;
}>;

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

function ProductPhoto({ image }: Readonly<{ image: ProductImage }>) {
  return (
    <figure className="usana-product-figure">
      {/* Product photography is kept at its source resolution. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
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
}: Readonly<{ image: ProductImage; name: string }>) {
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
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
        />
      </a>
      <figcaption>Hover to magnify · select for full size</figcaption>
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
  const states = featured
    ? (["Details", "Product + label"] as const)
    : (["Details", "Product", "Label"] as const);
  const [activeState, setActiveState] = useState(0);

  function advance() {
    setActiveState((current) => (current + 1) % states.length);
  }

  const nextState = states[(activeState + 1) % states.length];
  const className = [
    "usana-product-card",
    featured ? "is-featured" : "",
    editorPick ? "is-editor-pick" : "",
    compactTitle ? "has-compact-title" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    // The labeled state-control button is the keyboard equivalent; the article
    // click handler makes the remaining card surface a convenient pointer target.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <article
      className={className}
      data-state={activeState}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("a, button")) return;
        advance();
      }}
    >
      <div
        className={`usana-product-face usana-product-details${activeState === 0 ? " is-active" : ""}`}
        aria-hidden={activeState !== 0}
      >
        <p className="usana-product-label">{label}</p>
        <h3>{title ?? name}</h3>
        <div className="usana-product-copy">{children}</div>
        {fit ? <p className="usana-product-fit">{fit}</p> : null}
      </div>

      {featured ? (
        <div
          className={`usana-product-face usana-product-media usana-product-pair${activeState === 1 ? " is-active" : ""}`}
          aria-hidden={activeState !== 1}
        >
          <ProductPhoto image={product} />
          <LabelPhoto image={facts} name={name} />
        </div>
      ) : (
        <>
          <div
            className={`usana-product-face usana-product-media${activeState === 1 ? " is-active" : ""}`}
            aria-hidden={activeState !== 1}
          >
            <ProductPhoto image={product} />
          </div>
          <div
            className={`usana-product-face usana-product-media${activeState === 2 ? " is-active" : ""}`}
            aria-hidden={activeState !== 2}
          >
            <LabelPhoto image={facts} name={name} />
          </div>
        </>
      )}

      <button
        className="usana-product-state-control"
        type="button"
        onClick={advance}
        aria-label={`Showing ${states[activeState]} for ${name}, ${activeState + 1} of ${states.length}. Show ${nextState}.`}
      >
        <span>{states[activeState]}</span>
        <span className="usana-product-state-dots" aria-hidden="true">
          {states.map((state, index) => (
            <i className={index === activeState ? "is-active" : undefined} key={state} />
          ))}
        </span>
      </button>
    </article>
  );
}

const products = {
  cellsentials: {
    product: {
      src: "/images/usana/cellsentials-product.png",
      alt: "USANA CellSentials Core Minerals and Vita Antioxidant bottles",
      width: 1204,
      height: 1200,
    },
    facts: {
      src: "/images/usana/cellsentials-label.png",
      alt: "Supplement Facts labels for CellSentials Vita Antioxidant and Core Minerals",
      width: 850,
      height: 860,
    },
  },
  healthpak: {
    product: {
      src: "/images/usana/healthpak-product.png",
      alt: "USANA HealthPak box",
      width: 1206,
      height: 1200,
    },
    facts: {
      src: "/images/usana/healthpak-label.png",
      alt: "Supplement Facts label for USANA HealthPak",
      width: 409,
      height: 1000,
    },
  },
  procosa: {
    product: {
      src: "/images/usana/procosa-product.png",
      alt: "USANA Procosa bottle",
      width: 1102,
      height: 1102,
    },
    facts: {
      src: "/images/usana/procosa-label.png",
      alt: "Supplement Facts label for USANA Procosa",
      width: 1000,
      height: 935,
    },
  },
  biomega: {
    product: {
      src: "/images/usana/biomega-product.png",
      alt: "USANA BiOmega bottle",
      width: 1000,
      height: 1000,
    },
    facts: {
      src: "/images/usana/biomega-label.png",
      alt: "Supplement Facts label for USANA BiOmega",
      width: 1000,
      height: 956,
    },
  },
  magnecal: {
    product: {
      src: "/images/usana/magnecal-d-product.png",
      alt: "USANA MagneCal D bottle",
      width: 1072,
      height: 1074,
    },
    facts: {
      src: "/images/usana/magnecal-d-label.png",
      alt: "Supplement Facts label for USANA MagneCal D",
      width: 493,
      height: 401,
    },
  },
  coquinone: {
    product: {
      src: "/images/usana/coquinone-product.png",
      alt: "USANA CoQuinone 30 bottle",
      width: 1042,
      height: 1042,
    },
    facts: {
      src: "/images/usana/coquinone-label.png",
      alt: "Supplement Facts label for USANA CoQuinone 30",
      width: 498,
      height: 450,
    },
  },
  clearProtein: {
    product: {
      src: "/images/usana/clear-protein-creatine-product.png",
      alt: "USANA Clear Protein and Creatine green apple pouch",
      width: 734,
      height: 1010,
    },
    facts: {
      src: "/images/usana/clear-protein-creatine-label.png",
      alt: "Supplement Facts label for USANA Clear Protein and Creatine green apple mix",
      width: 488,
      height: 1000,
    },
  },
  coreAminos: {
    product: {
      src: "/images/usana/core-aminos-product.png",
      alt: "USANA Core Aminos tub",
      width: 850,
      height: 844,
    },
    facts: {
      src: "/images/usana/core-aminos-label.png",
      alt: "Supplement Facts label for USANA Core Aminos",
      width: 850,
      height: 794,
    },
  },
} as const satisfies Record<
  string,
  Readonly<{ product: ProductImage; facts: ProductImage }>
>;

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
          Core Minerals and Vita-Antioxidant form USANA&apos;s main daily
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
        label="Joy Health pick"
        editorPick
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
