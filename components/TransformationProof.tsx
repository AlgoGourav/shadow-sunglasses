"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import HandUnderline from "./HandUnderline";
import styles from "./TransformationProof.module.css";

export default function TransformationProof() {
  const [position, setPosition] = useState(50);
  const frame = useRef<HTMLDivElement>(null);
  const manual = useRef(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let pending = 0;
    const update = () => {
      pending = 0;
      if (preference.matches || manual.current || !frame.current) return;
      const top = frame.current.getBoundingClientRect().top;
      const progress = Math.min(1, Math.max(0, (innerHeight*0.7-top)/(innerHeight*0.5)));
      setPosition(Math.round(progress*100));
    };
    const schedule = () => { if (!pending) pending = requestAnimationFrame(update); };
    const onScroll = () => { manual.current = false; schedule(); };
    window.addEventListener("scroll", onScroll, {passive:true});
    window.addEventListener("resize", schedule);
    preference.addEventListener("change", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(pending);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
      preference.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <section className={`${styles.section} container`}>
      <Reveal>
        <h2 className={styles.heading}>
          Same glasses. Drag to see{" "}
          <HandUnderline mode="scrub">the difference.</HandUnderline>
        </h2>
        <p className={styles.lede}>
          No new frames, no lost prescription. One tint, pressed on in
          seconds, and your everyday glasses do double duty in the sun.
        </p>
      </Reveal>

      <Reveal delayStep={1} className={styles.compareWrap}>
        <div className={styles.compare} style={{ "--pos": `${position}%` } as React.CSSProperties}>
          <span className={`mono-label ${styles.tag} ${styles.tagBefore}`} style={{opacity:position>=95?0:1}} aria-hidden={position>=95}>Before</span>
          <span className={`mono-label ${styles.tag} ${styles.tagAfter}`} style={{opacity:position<=5?0:1}} aria-hidden={position<=5}>After</span>

          <div ref={frame} className={styles.frame}>
            <Image
              src="/images/hero-optical-clear.webp"
              alt="Clear prescription glasses with no tint applied"
              fill
              sizes="(min-width: 780px) 60vw, 90vw"
            />
            <div className={styles.afterLayer}>
              <Image
                src="/images/hero-optical-blue.webp"
                alt="The same prescription glasses wearing a full-coverage Blue Mirror Shadow film"
                fill
                sizes="(min-width: 780px) 60vw, 90vw"
              />
            </div>
            <div className={styles.handle} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M8 8l-4 4 4 4M4 12h6M16 8l4 4-4 4M14 12h6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={position}
            onChange={(event) => { manual.current = true; setPosition(Number(event.target.value)); }}
            className={styles.slider}
            aria-label="Drag to compare before and after"
            aria-valuetext={`${position}% tinted. Move right to apply the tint.`}
          />
          <p className={styles.instruction}>Scroll to reveal the tint left to right. Or swipe the divider.</p>
        </div>
      </Reveal>
    </section>
  );
}
