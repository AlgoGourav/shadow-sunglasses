"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Button from "../Button";
import QuantityStepper from "../QuantityStepper";
import styles from "./PurchasePanel.module.css";
import { useCart } from "@/lib/cart-context";
import { PACKS, formatPrice, type PackSize } from "@/lib/pricing";
import type { Tint } from "@/lib/tints";

export default function PurchasePanel({ tint }: { tint: Tint }) {
  const { addItem } = useCart();
  const [packSize, setPackSize] = useState<PackSize>("3");
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  const pack = PACKS.find((p) => p.value === packSize) ?? PACKS[1];
  const total = pack.price * quantity;

  function handleAdd() {
    addItem(tint.slug, packSize, quantity);
    setJustAdded(true);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setJustAdded(false), 2200);
  }

  return (
    <div className={styles.panel}>
      <div className={styles.field}>
        <span className={`mono-label ${styles.label}`}>Pack size</span>
        <div className={styles.packGrid} role="radiogroup" aria-label="Pack size">
          {PACKS.map((p) => (
            <label key={p.value} className={styles.packOption}>
              <input
                type="radio"
                name={`pack-${tint.slug}`}
                value={p.value}
                checked={packSize === p.value}
                onChange={() => setPackSize(p.value)}
              />
              <span className={styles.packCard}>
                <span className={styles.packLabel}>{p.label}</span>
                <span className={`mono-label ${styles.packPrice}`}>{p.priceLabel}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <span className={`mono-label ${styles.label}`}>Quantity</span>
          <QuantityStepper quantity={quantity} onChange={setQuantity} max={10} />
        </div>

        <div className={styles.priceField}>
          <span className={`mono-label ${styles.label}`}>Total</span>
          <span className={styles.total}>{formatPrice(total)}</span>
        </div>
      </div>

      <Button
        type="button"
        variant="primary"
        className={styles.addButton}
        onClick={handleAdd}
      >
        {justAdded ? "Added ✓" : "Add to bag"}
      </Button>

      <p className={styles.confirmation} role="status" aria-live="polite">
        {justAdded ? (
          <>
            {tint.name} added to your bag.{" "}
            <Link href="/cart" className={styles.confirmationLink}>
              View bag →
            </Link>
          </>
        ) : (
          ""
        )}
      </p>
    </div>
  );
}
