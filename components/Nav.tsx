"use client";

import Link from "next/link";
import styles from "./Nav.module.css";
import Button from "./Button";
import { useCart } from "@/lib/cart-context";

export default function Nav() {
  const { itemCount, hydrated } = useCart();
  const showBadge = hydrated && itemCount > 0;

  return (
    <header className={styles.nav}>
      <div className={`${styles.inner} container`}>
        <Link href="/" className={styles.mark}>
          SHADOW
        </Link>
        <ul className={styles.links}>
          <li>
            <Link href="/#how-it-works">How it works</Link>
          </li>
          <li>
            <Link href="/#colors">Colors</Link>
          </li>
          <li>
            <Link href="/#specs">Specs</Link>
          </li>
        </ul>
        <div className={styles.actions}>
          <Link
            href="/cart"
            className={styles.bagLink}
            aria-label={showBadge ? `View bag, ${itemCount} item${itemCount === 1 ? "" : "s"}` : "View bag"}
          >
            <svg
              className={styles.bagIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path
                d="M7 8.5V7a5 5 0 0 1 10 0v1.5M4.5 8.5h15l-.9 11.2a1.5 1.5 0 0 1-1.5 1.3H6.9a1.5 1.5 0 0 1-1.5-1.3L4.5 8.5Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {showBadge && (
              <span className={styles.badge} aria-hidden="true">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
          <Button href="/#signup" variant="primary">
            Shop now
          </Button>
        </div>
      </div>
    </header>
  );
}
