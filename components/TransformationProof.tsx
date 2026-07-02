"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import styles from "./TransformationProof.module.css";

export default function TransformationProof() {
  const [position, setPosition] = useState(50);

  return (
    <section className={`${styles.section} container`}>
      <Reveal>
        <h2 className={styles.heading}>Same glasses. Drag to see the difference.</h2>
        <p className={styles.lede}>
          No new frames, no lost prescription. One tint, pressed on in
          seconds, and your everyday glasses do double duty in the sun.
        </p>
      </Reveal>

      <Reveal delayStep={1} className={styles.compareWrap}>
        <div className={styles.compare} style={{ "--pos": `${position}%` } as React.CSSProperties}>
          <span className={`mono-label ${styles.tag} ${styles.tagBefore}`}>Before</span>
          <span className={`mono-label ${styles.tag} ${styles.tagAfter}`}>After</span>

          <div className={styles.frame}>
            <Image
              src="/images/explainer-after.png"
              alt="The same glasses wearing a dark Shadow tint, functioning as sunglasses"
              fill
              sizes="(min-width: 780px) 60vw, 90vw"
            />
            <div className={styles.beforeLayer}>
              <Image
                src="/images/explainer-before.png"
                alt="Clear prescription glasses with no tint applied"
                fill
                sizes="(min-width: 780px) 60vw, 90vw"
              />
            </div>
            <div className={styles.handle} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M14 7l-5 5 5 5M10 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" transform="scale(0.75) translate(4 4)" />
              </svg>
            </div>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={position}
            onChange={(event) => setPosition(Number(event.target.value))}
            className={styles.slider}
            aria-label="Drag to compare before and after"
          />
        </div>
      </Reveal>
    </section>
  );
}
