"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "../Reveal";
import Button from "../Button";
import CartLineItem from "./CartLineItem";
import CheckoutForm from "./CheckoutForm";
import styles from "./CartView.module.css";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/pricing";

export default function CartView() {
  const { items, subtotal, hydrated } = useCart();
  const [confirmation, setConfirmation] = useState<string | null>(null);

  return (
    <main id="main-content" className={styles.section}>
      <div className="container">
        <Reveal>
          <h1 className={styles.heading}>Your bag.</h1>
        </Reveal>

        {!hydrated ? (
          <div className={styles.loading} aria-hidden="true" />
        ) : confirmation ? (
          <Reveal delayStep={1} className={styles.empty}>
            <p className={styles.emptyLede} role="status">
              {confirmation}
            </p>
            <Button href="/#colors" variant="primary">
              Browse more tints
            </Button>
          </Reveal>
        ) : items.length === 0 ? (
          <Reveal delayStep={1} className={styles.empty}>
            <p className={styles.emptyLede}>
              Nothing in here yet.{" "}
              <span className="hand-accent">Pick a tint</span> and add it to
              your bag.
            </p>
            <Button href="/#colors" variant="primary">
              Browse tints
            </Button>
          </Reveal>
        ) : (
          <Reveal delayStep={1} className={styles.layout}>
            <div>
              <ul className={styles.list}>
                {items.map((item) => (
                  <CartLineItem key={`${item.tintSlug}-${item.packSize}`} item={item} />
                ))}
              </ul>

              <div className={styles.summary}>
                <span className={styles.summaryLabel}>Subtotal</span>
                <span className={styles.summaryValue}>{formatPrice(subtotal)}</span>
              </div>
              <p className={styles.summaryNote}>
                No payment today — this reserves your order. We&apos;ll confirm total and
                shipping when we reach out.
              </p>

              <Link href="/#colors" className={styles.continue}>
                ← Keep browsing
              </Link>
            </div>

            <div className={styles.checkout}>
              <CheckoutForm onSuccess={setConfirmation} />
            </div>
          </Reveal>
        )}
      </div>
    </main>
  );
}
