"use client";

import Image from "next/image";
import Link from "next/link";
import QuantityStepper from "../QuantityStepper";
import styles from "./CartLineItem.module.css";
import { useCart, type CartItem } from "@/lib/cart-context";
import { getPack, formatPrice } from "@/lib/pricing";
import { getTint } from "@/lib/tints";

export default function CartLineItem({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();
  const tint = getTint(item.tintSlug);
  const pack = getPack(item.packSize);

  if (!tint) return null;

  return (
    <li className={styles.item}>
      <Link href={`/shades/${tint.slug}`} className={styles.frame}>
        <Image
          src={tint.mainImage}
          alt={`${tint.name} Shadow tint applied to glasses`}
          fill
          sizes="120px"
        />
      </Link>

      <div className={styles.details}>
        <div className={styles.heading}>
          <Link href={`/shades/${tint.slug}`} className={styles.name}>
            {tint.name}
          </Link>
          <span
            className={styles.dot}
            style={{ background: `var(--tint-${tint.slug})` }}
            aria-hidden="true"
          />
        </div>
        <span className={`mono-label ${styles.pack}`}>
          {pack.label} · {pack.priceLabel} each
        </span>

        <div className={styles.controls}>
          <QuantityStepper
            quantity={item.quantity}
            onChange={(quantity) => updateQuantity(item.tintSlug, item.packSize, quantity)}
            max={10}
            label={`${tint.name} quantity`}
          />
          <button
            type="button"
            className={styles.remove}
            onClick={() => removeItem(item.tintSlug, item.packSize)}
          >
            Remove
          </button>
        </div>
      </div>

      <span className={styles.lineTotal}>{formatPrice(pack.price * item.quantity)}</span>
    </li>
  );
}
