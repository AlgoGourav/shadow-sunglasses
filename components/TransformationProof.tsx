"use client";

import { useEffect, useRef, useState, type PointerEvent, type KeyboardEvent } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import HandUnderline from "./HandUnderline";
import Button from "./Button";
import styles from "./TransformationProof.module.css";

export default function TransformationProof() {
  const [position, setPosition] = useState(50);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const runway = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const photograph = useRef<HTMLDivElement>(null);
  const manual = useRef(false);
  const gesture = useRef<{ id: number; x: number; y: number; position: number; dragging: boolean } | null>(null);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let pending = 0;
    const update = () => {
      pending = 0;
      if (!frame.current || !runway.current) return;
      const navOffset = (document.querySelector("body > header")?.getBoundingClientRect().height ?? 80) + 16;
      runway.current.style.setProperty("--compare-nav", `${navOffset}px`);
      const offset = Math.max(navOffset, (innerHeight-frame.current.offsetHeight)/2);
      runway.current.style.setProperty("--compare-offset", `${offset}px`);
      const enabled = !preference.matches && frame.current.offsetHeight < innerHeight-navOffset-32;
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

  function startGesture(event: PointerEvent<HTMLButtonElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, position, dragging: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveGesture(event: PointerEvent<HTMLButtonElement>) {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId || !photograph.current) return;
    const dx = event.clientX-current.x;
    const dy = event.clientY-current.y;
    if (!current.dragging) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
      if (Math.abs(dy) >= Math.abs(dx)) { endGesture(event); return; }
      current.dragging = true;
      manual.current = true;
    }
    setPosition(Math.round(Math.min(100, Math.max(0, current.position-dx/photograph.current.offsetWidth*100))));
  }

  function endGesture(event: PointerEvent<HTMLButtonElement>) {
    if (gesture.current?.id !== event.pointerId) return;
    gesture.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function adjustWithKeyboard(event: KeyboardEvent<HTMLButtonElement>) {
    const changes: Record<string, number> = { ArrowRight: 2, ArrowUp: 2, ArrowLeft: -2, ArrowDown: -2, PageUp: 10, PageDown: -10 };
    if (event.key !== "Home" && event.key !== "End" && changes[event.key] === undefined) return;
    event.preventDefault();
    manual.current = true;
    setPosition(current => event.key === "Home" ? 0 : event.key === "End" ? 100 : Math.min(100, Math.max(0, current+changes[event.key])));
  }

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
        <div ref={frame} className={styles.compare} style={{ "--split": `${100-position}%` } as React.CSSProperties}>
          <div className={styles.labels} aria-hidden="true"><span>Before</span><span>After</span></div>

          <div ref={photograph} className={styles.frame}>
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
            <div className={styles.divider} aria-hidden="true" />
            <button type="button" className={styles.handle} role="slider" aria-label="Compare before and after" aria-valuemin={0} aria-valuemax={100} aria-valuenow={position} aria-valuetext={`${position}% tinted`} aria-orientation="horizontal" onPointerDown={startGesture} onPointerMove={moveGesture} onPointerUp={endGesture} onPointerCancel={endGesture} onLostPointerCapture={() => { gesture.current = null; }} onKeyDown={adjustWithKeyboard}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                <path d="M8 8l-4 4 4 4M4 12h6M16 8l4 4-4 4M14 12h6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <p className={styles.instruction}>{scrollEnabled ? "Scroll to reveal · drag the handle to compare" : "Drag the handle to compare"}</p>
        </div>
      </div>
      <div className={styles.next}>
        <Button href="#how-it-works" variant="ghost">how to apply</Button>
      </div>
    </section>
  );
}
