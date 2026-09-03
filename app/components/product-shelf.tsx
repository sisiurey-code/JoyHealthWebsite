import {
  PRODUCT_SHELF,
  responsiveProductSources,
  USANA_PRODUCT_IMAGES,
} from "../lib/usana";

const shelfSizes = "(max-width: 760px) 45vw, (max-width: 1100px) 22vw, 220px";

type ProductShelfProps = Readonly<{
  /** Optional caption rendered below the tiles. */
  caption?: string;
}>;

/**
 * A static, server-rendered grid of product photographs. It is the visual
 * anchor for product-first sections and needs no client JavaScript.
 */
export function ProductShelf({ caption }: ProductShelfProps) {
  return (
    <figure className="product-shelf">
      <ul className="product-shelf-grid" aria-label="Featured products">
        {PRODUCT_SHELF.map(({ key, name, role }) => {
          const image = USANA_PRODUCT_IMAGES[key].product;
          return (
            <li key={key}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                srcSet={responsiveProductSources(image)}
                sizes={shelfSizes}
                alt={image.alt}
                width={image.width}
                height={image.height}
                loading="lazy"
                decoding="async"
              />
              <span>
                <strong>{name}</strong>
                <small>{role}</small>
              </span>
            </li>
          );
        })}
      </ul>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
