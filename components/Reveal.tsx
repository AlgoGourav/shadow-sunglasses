"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  as?: "div" | "li";
  delayStep?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Content is visible by default (server-rendered, no-JS, and reduced-motion all
 * see the final state immediately). Only after mount do we optimistically hide
 * not-yet-visible elements and reveal them on intersection, with a fallback
 * timeout so a reveal can never get stuck hidden (e.g. paused hidden tabs).
 */
export default function Reveal({
  children,
  as = "div",
  delayStep = 0,
  className = "",
  style,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | HTMLLIElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !("IntersectionObserver" in window)) return;

    const rect = node.getBoundingClientRect();
    const alreadyInView = rect.top < window.innerHeight * 0.92;
    if (alreadyInView) return;

    node.classList.add("reveal-pending");

    const fallback = window.setTimeout(() => {
      node.classList.remove("reveal-pending");
    }, 2000);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.classList.remove("reveal-pending");
            window.clearTimeout(fallback);
            observer.unobserve(node);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(node);

    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, []);

  const Tag = as;

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${className}`}
      style={{ ...style, ["--reveal-i" as string]: delayStep }}
    >
      {children}
    </Tag>
  );
}
