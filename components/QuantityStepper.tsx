"use client";

import styles from "./QuantityStepper.module.css";

type Props = {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  label?: string;
};

export default function QuantityStepper({
  quantity,
  onChange,
  min = 1,
  max = 10,
  label = "Quantity",
}: Props) {
  return (
    <div className={styles.stepper}>
      <button
        type="button"
        className={styles.stepBtn}
        onClick={() => onChange(Math.max(min, quantity - 1))}
        disabled={quantity <= min}
        aria-label={`Decrease ${label.toLowerCase()}`}
      >
        −
      </button>
      <span className={styles.stepValue} aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        className={styles.stepBtn}
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        aria-label={`Increase ${label.toLowerCase()}`}
      >
        +
      </button>
    </div>
  );
}
