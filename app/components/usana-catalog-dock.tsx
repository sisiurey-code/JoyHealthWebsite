"use client";

import { useEffect, useRef, useState } from "react";
import { USANA_STOREFRONT_URL } from "../lib/usana";

const preferenceKey = "joy-health-usana-catalog";
const viewportMargin = 8;

type Offset = Readonly<{ x: number; y: number }>;

type DragSession = Readonly<{
  pointerId: number;
  startX: number;
  startY: number;
  origin: Offset;
  rect: DOMRect;
}>;

function getDockTopBoundary() {
  const headerOffset = Number.parseFloat(
    window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--sticky-header-offset"),
  );

  return (Number.isFinite(headerOffset) ? headerOffset : 0) + viewportMargin;
}

function keepDockInView(dock: HTMLElement, next: Offset, current: Offset): Offset {
  const rect = dock.getBoundingClientRect();
  const deltaX = next.x - current.x;
  const deltaY = next.y - current.y;
  const proposed = {
    left: rect.left + deltaX,
    right: rect.right + deltaX,
    top: rect.top + deltaY,
    bottom: rect.bottom + deltaY,
  };
  const topBoundary = getDockTopBoundary();
  const availableWidth = window.innerWidth - viewportMargin * 2;
  const availableHeight = window.innerHeight - topBoundary - viewportMargin;
  let x = next.x;
  let y = next.y;

  if (rect.width > availableWidth) {
    x += viewportMargin - proposed.left;
  } else if (proposed.left < viewportMargin) {
    x += viewportMargin - proposed.left;
  } else if (proposed.right > window.innerWidth - viewportMargin) {
    x -= proposed.right - (window.innerWidth - viewportMargin);
  }
  if (rect.height > availableHeight) {
    y += topBoundary - proposed.top;
  } else if (proposed.top < topBoundary) {
    y += topBoundary - proposed.top;
  } else if (proposed.bottom > window.innerHeight - viewportMargin) {
    y -= proposed.bottom - (window.innerHeight - viewportMargin);
  }

  return { x, y };
}

export function UsanaCatalogDock() {
  const dockRef = useRef<HTMLElement>(null);
  const dragSessionRef = useRef<DragSession | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 });

  useEffect(() => {
    let frame: number | undefined;

    try {
      if (window.localStorage.getItem(preferenceKey) === "closed") {
        frame = window.requestAnimationFrame(() => setIsOpen(false));
      }
    } catch {
      // The panel remains usable when storage is unavailable.
    }

    return () => {
      if (frame !== undefined) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    function constrainPosition() {
      const dock = dockRef.current;
      if (!dock) return;
      setOffset((current) => keepDockInView(dock, current, current));
    }

    const frame = window.requestAnimationFrame(constrainPosition);
    window.addEventListener("resize", constrainPosition);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", constrainPosition);
    };
  }, [isOpen]);

  function rememberOpenState(nextOpen: boolean) {
    setIsOpen(nextOpen);
    try {
      window.localStorage.setItem(preferenceKey, nextOpen ? "open" : "closed");
    } catch {
      // The panel remains usable when storage is unavailable.
    }
  }

  return (
    <section className="usana-catalog-region" aria-label="USANA product catalog">
      <aside
        className={`usana-catalog-dock${isOpen ? " is-open" : ""}`}
        data-dragging={isDragging ? "true" : undefined}
        id="catalog"
        ref={dockRef}
        aria-labelledby="catalog-dock-title"
        style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
      >
        <div
          className="usana-catalog-header"
          onPointerDown={(event) => {
            if ((event.target as HTMLElement).closest(".usana-catalog-toggle")) return;
            if (event.pointerType === "mouse" && event.button !== 0) return;
            const dock = dockRef.current;
            if (!dock) return;

            dragSessionRef.current = {
              pointerId: event.pointerId,
              startX: event.clientX,
              startY: event.clientY,
              origin: offset,
              rect: dock.getBoundingClientRect(),
            };
            event.currentTarget.setPointerCapture(event.pointerId);
            setIsDragging(true);
          }}
          onPointerMove={(event) => {
            const drag = dragSessionRef.current;
            if (!drag || drag.pointerId !== event.pointerId) return;

            const nextX = drag.origin.x + event.clientX - drag.startX;
            const nextY = drag.origin.y + event.clientY - drag.startY;
            const minX = drag.origin.x + viewportMargin - drag.rect.left;
            const maxX =
              drag.origin.x + window.innerWidth - viewportMargin - drag.rect.right;
            const minY = drag.origin.y + getDockTopBoundary() - drag.rect.top;
            const maxY =
              drag.origin.y + window.innerHeight - viewportMargin - drag.rect.bottom;

            setOffset({
              x: Math.min(Math.max(nextX, minX), maxX),
              y: maxY < minY ? minY : Math.min(Math.max(nextY, minY), maxY),
            });
          }}
          onPointerUp={(event) => {
            if (dragSessionRef.current?.pointerId !== event.pointerId) return;
            dragSessionRef.current = null;
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
            setIsDragging(false);
          }}
          onPointerCancel={() => {
            dragSessionRef.current = null;
            setIsDragging(false);
          }}
          onLostPointerCapture={() => {
            dragSessionRef.current = null;
            setIsDragging(false);
          }}
        >
          <span className="usana-catalog-heading">
            <span className="eyebrow">USANA storefront</span>
            <strong id="catalog-dock-title">Explore formulas, labels, and prices</strong>
          </span>
          <span className="usana-catalog-controls">
            <button
              className="usana-catalog-toggle"
              type="button"
              aria-expanded={isOpen}
              aria-controls="usana-catalog-panel"
              aria-label={isOpen ? "Minimize the catalog panel" : "Expand the catalog panel"}
              onClick={() => rememberOpenState(!isOpen)}
            >
              <span aria-hidden="true" />
            </button>
          </span>
        </div>

        {isOpen ? (
          <div className="usana-catalog-panel" id="usana-catalog-panel">
            <div>
              <h2>Compare the label, not just the product name.</h2>
              <p>
                Check the serving size, Supplement Facts, and specific ingredients before choosing.
              </p>
            </div>
            <div className="usana-catalog-action">
              <p>
                <strong>Affiliate disclosure:</strong> Joy Health may earn a
                commission if you buy through this link. Compensation does not
                change the evidence standards or the order of products.
              </p>
              <a href={USANA_STOREFRONT_URL} rel="sponsored">
                Browse the USANA catalog <span aria-hidden="true">↗</span>
              </a>
              <small>You&apos;ll leave Joy Health for sissi.usana.com.</small>
            </div>
          </div>
        ) : null}
      </aside>
    </section>
  );
}
