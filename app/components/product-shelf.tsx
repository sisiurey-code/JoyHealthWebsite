import Link from "next/link";
import { SUPPLEMENT_PRODUCTS } from "../lib/supplements";
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
 * A static, server-rendered grid of product photographs, each tile linking to
 * that product's label page. It needs no client JavaScript.
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
                <strong>
                  <Link href={SUPPLEMENT_PRODUCTS.find((product) => product.key === key)!.path}>
                    {name}
                  </Link>
                </strong>
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
