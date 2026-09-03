"use client";

import { useState } from "react";

const slides = [
  {
    src: "/images/joy-health-morning.webp",
    alt: "Hands adding citrus to a bowl beside water and an open notebook in morning light",
    title: "No cure-alls here.",
    copy: "There is no single fix, but there are steady, practical steps most people can take.",
  },
  {
    src: "/images/joy-health-balanced-meal.webp",
    alt: "Hands arranging grains, greens, vegetables, and salmon on a ceramic plate",
    title: "Meals you can repeat on a weekday.",
    copy: "If it only works in a perfect kitchen, it does not work. We focus on meals and routines people can repeat.",
  },
  {
    src: "/images/joy-health-garden-recovery.webp",
    alt: "A person setting down water beside fruit and a book after a garden walk",
    title: "Supplements are one piece, not the plan.",
    copy: "Food, movement, rest, and supplements all share the same week. No single piece carries it alone.",
  },
] as const;

const heroSizes = "(max-width: 760px) 100vw, (max-width: 1180px) 50vw, 836px";

function responsiveHeroSource(src: string, width: number) {
  const basename = src.slice(src.lastIndexOf("/") + 1, src.lastIndexOf("."));
  return `/images/responsive/hero/${basename}-${width}.webp`;
}

export function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  function showSlide(index: number) {
    setActiveIndex((index + slides.length) % slides.length);
  }

  function showNext() {
    showSlide(activeIndex + 1);
  }

  return (
    <figure className="hero-visual">
      <button
        className="hero-media"
        type="button"
        onClick={showNext}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            showSlide(activeIndex - 1);
          }

          if (event.key === "ArrowRight") {
            event.preventDefault();
            showNext();
          }
        }}
        aria-label="Show the next wellness scene"
      >
        {slides.map((slide, index) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className={index === activeIndex ? "is-active" : undefined}
            key={slide.src}
            src={responsiveHeroSource(slide.src, 1672)}
            srcSet={[640, 1024, 1672]
              .map(
                (width) => `${responsiveHeroSource(slide.src, width)} ${width}w`,
              )
              .join(", ")}
            sizes={heroSizes}
            alt={index === activeIndex ? slide.alt : ""}
            width="1672"
            height="941"
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            decoding="async"
            aria-hidden={index !== activeIndex}
          />
        ))}
      </button>

      <div
        className="hero-carousel-controls"
        role="group"
        aria-label="Choose a wellness scene"
      >
        {slides.map((slide, index) => (
          <button
            className={index === activeIndex ? "is-active" : undefined}
            type="button"
            key={slide.src}
            onClick={() => showSlide(index)}
            aria-label={`Show scene ${index + 1}: ${slide.title}`}
            aria-current={index === activeIndex ? "true" : undefined}
          />
        ))}
      </div>

      <figcaption className="photo-note" aria-live="polite">
        <span aria-hidden="true">[•]</span>
        <p>
          <strong>{slides[activeIndex].title}</strong>{" "}
          {slides[activeIndex].copy}
        </p>
      </figcaption>
    </figure>
  );
}
