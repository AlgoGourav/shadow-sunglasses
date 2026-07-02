"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./ProductGallery.module.css";
import type { Tint } from "@/lib/tints";

export default function ProductGallery({ tint }: { tint: Tint }) {
  const images = [
    { src: tint.mainImage, alt: `${tint.name} Shadow tint applied to glasses` },
    { src: tint.detailImage, alt: tint.detailAlt },
    ...(tint.lookbookImage
      ? [{ src: tint.lookbookImage, alt: tint.lookbookCaption ?? `${tint.name} worn in context` }]
      : []),
  ];

  const [active, setActive] = useState(0);

  return (
    <div className={styles.gallery}>
      <div className={styles.frame}>
        {images.map((image, i) => (
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt}
            fill
            priority={i === 0}
            sizes="(min-width: 900px) 44vw, 90vw"
            className={styles.image}
            style={{ opacity: active === i ? 1 : 0 }}
          />
        ))}
      </div>

      {images.length > 1 && (
        <div className={styles.thumbs} role="tablist" aria-label={`${tint.name} images`}>
          {images.map((image, i) => (
            <button
              key={image.src}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-label={`View image ${i + 1} of ${images.length}`}
              className={styles.thumb}
              data-active={active === i}
              onClick={() => setActive(i)}
            >
              <Image src={image.src} alt="" fill sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
