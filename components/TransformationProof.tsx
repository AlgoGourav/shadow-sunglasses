"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import HandUnderline from "./HandUnderline";
import Button from "./Button";
import styles from "./TransformationProof.module.css";

export default function TransformationProof() {
  const [position, setPosition] = useState(50);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const sliderId = useId();
  const runway = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const manual = useRef(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let pending = 0;
    const update = () => {
      pending = 0;
      if (!frame.current || !runway.current) return;
      const offset = (document.querySelector("body > header")?.getBoundingClientRect().height ?? 80) + 16;
      runway.current.style.setProperty("--compare-offset", `${offset}px`);
      const enabled = !preference.matches && innerWidth >= 780 && frame.current.offsetHeight < innerHeight-offset-32;
      setScrollEnabled(enabled);
      if (!enabled || manual.current) return;
      const travel = Math.max(1, runway.current.offsetHeight-frame.current.offsetHeight);
      const progress = (offset-runway.current.getBoundingClientRect().top)/travel;
      // Begin only once the comparison is pinned, with a hold at either end.
      setPosition(Math.round(Math.min(1, Math.max(0, (progress-0.12)/0.76))*100));
    };
    const schedule = () => { if (!pending) pending = requestAnimationFrame(update); };
    const onScroll = () => {
      const bounds = runway.current?.getBoundingClientRect();
      if (bounds && (bounds.bottom <= 0 || bounds.top >= innerHeight)) manual.current = false;
      schedule();
    };
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
    <section id="compare" className={`${styles.section} container`}>
      <Reveal>
        <h2 className={styles.heading}>
          See{" "}
          <HandUnderline mode="scrub">the difference.</HandUnderline>
        </h2>
        <p className={styles.lede}>
          No new frames, no lost prescription. One tint, pressed on in
          seconds, and your everyday glasses do double duty in the sun.
        </p>
      </Reveal>

      <div ref={runway} className={styles.compareWrap} data-scroll={scrollEnabled}>
        <div ref={frame} className={styles.compare} style={{ "--pos": `${position}%` } as React.CSSProperties}>
          <span className={`mono-label ${styles.tag} ${styles.tagBefore}`} style={{opacity:position>=95?0:1}} aria-hidden={position>=95}>Before</span>
          <span className={`mono-label ${styles.tag} ${styles.tagAfter}`} style={{opacity:position<=5?0:1}} aria-hidden={position<=5}>After</span>

          <div className={styles.frame}>
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

          <div className={styles.controls}>
          <label htmlFor={sliderId}>Before</label>
          <input
            id={sliderId}
            type="range"
            min={0}
            max={100}
            value={position}
            onChange={(event) => { manual.current = true; setPosition(Number(event.target.value)); }}
            className={styles.slider}
            aria-label="Compare before and after"
            aria-valuetext={`${position}% tinted. Move right to apply the tint.`}
          />
          <span>After</span>
          </div>
          <p className={styles.instruction}>{scrollEnabled ? "Scroll to compare, or drag the slider below." : "Drag the slider to compare."}</p>
        </div>
      </div>
      <div className={styles.next}>
        <Button href="#how-it-works" variant="ghost">how to apply</Button>
      </div>
    </section>
  );
}
