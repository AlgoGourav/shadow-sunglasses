"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./FirstHundredBadge.module.css";

const TARGET = 100;

/**
 * Decorative count-up to 100 — a goal/invitation, not a claim about a live
 * signup count. Shows the final "100" by default (server-rendered/no-JS/
 * reduced-motion), animates from 0 the first time it actually scrolls into
 * view. No fallback timer: unlike Reveal, the idle state here is already the
 * correct final value, so there's nothing to rescue — a timer would only risk
 * firing before the reader arrives and spoiling the count-up.
 */
export default function FirstHundredBadge() {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(TARGET);
  const [pop, setPop] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !("IntersectionObserver" in window)) return;

    function animate() {
      setValue(0);
      const duration = 1400;
      const start = performance.now();
      function tick(now: number) {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(Math.round(eased * TARGET));
        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          setPop(true);
          window.setTimeout(() => setPop(false), 260);
        }
      }
      requestAnimationFrame(tick);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={wrapRef}
      className={styles.badge}
      aria-label={`Goal: first ${TARGET} reservations`}
    >
      <span className={styles.number} data-pop={pop} aria-hidden="true">
        {value}
      </span>
    </span>
  );
}
