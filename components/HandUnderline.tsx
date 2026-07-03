"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./HandUnderline.module.css";

type Props = {
  children: ReactNode;
  mode: "replay" | "scrub";
  className?: string;
};

const PATH_D = "M2 9C22 3 45 2 60 5C78 8.5 100 4 118 7";

/**
 * A hand-drawn SVG stroke beneath its children, always in `currentColor` so it
 * matches the surrounding text on any surface. Fully drawn by default (server-
 * rendered/no-JS/reduced-motion see the final state immediately, same
 * philosophy as Reveal). "replay" mode toggles drawn/undrawn as the element
 * enters/leaves the viewport, with a fallback timeout so it can never get
 * stuck hidden. "scrub" mode binds the stroke continuously to scroll position.
 */
export default function HandUnderline({ children, mode, className = "" }: Props) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [length, setLength] = useState<number | null>(null);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    if (pathRef.current) setLength(pathRef.current.getTotalLength());
  }, []);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !("IntersectionObserver" in window)) return;

    if (mode === "replay") {
      const rect = node.getBoundingClientRect();
      const alreadyInView =
        rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
      if (!alreadyInView) setProgress(0);

      const fallback = window.setTimeout(() => setProgress(1), 2000);
      const observer = new IntersectionObserver(
        ([entry]) => {
          setProgress(entry.isIntersecting ? 1 : 0);
          window.clearTimeout(fallback);
        },
        { threshold: 0.5, rootMargin: "0px 0px -8% 0px" }
      );
      observer.observe(node);

      return () => {
        window.clearTimeout(fallback);
        observer.disconnect();
      };
    }

    let frame = 0;
    function update() {
      const rect = node!.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = (vh - rect.top) / (vh + rect.height);
      setProgress(Math.min(1, Math.max(0, raw)));
      frame = 0;
    }
    function onScroll() {
      if (frame) return;
      frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [mode]);

  const dashoffset = length ? length * (1 - progress) : 0;

  return (
    <span ref={wrapRef} className={`${styles.wrap} ${className}`}>
      {children}
      <svg
        className={styles.underline}
        viewBox="0 0 120 14"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          ref={pathRef}
          d={PATH_D}
          className={mode === "replay" ? styles.replayPath : styles.scrubPath}
          style={length ? { strokeDasharray: length, strokeDashoffset: dashoffset } : undefined}
        />
      </svg>
    </span>
  );
}
