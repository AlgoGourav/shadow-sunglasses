"use client";

import { useId, useState, type FormEvent } from "react";
import styles from "./CheckoutForm.module.css";
import Button from "../Button";
import { useCart } from "@/lib/cart-context";

type Status =
  | { tone: "idle" }
  | { tone: "submitting" }
  | { tone: "success"; message: string }
  | { tone: "duplicate"; message: string }
  | { tone: "error"; message: string };

export default function CheckoutForm({ onSuccess }: { onSuccess: (message: string) => void }) {
  const { items, clear } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<Status>({ tone: "idle" });
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const addressId = useId();
  const statusId = useId();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (items.length === 0) return;
    setStatus({ tone: "submitting" });

    const primary = items[0];

    try {
      const response = await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          address,
          packSize: primary.packSize,
          colorPreference: primary.tintSlug,
          cartItems: items,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setStatus({ tone: "error", message: data.error ?? "Something went wrong on our end. Please try again." });
        return;
      }

      if (data.status === "duplicate") {
        setStatus({ tone: "duplicate", message: data.message });
        return;
      }

      setStatus({ tone: "success", message: data.message });
      clear();
      onSuccess(data.message);
    } catch {
      setStatus({
        tone: "error",
        message: "We couldn't reach the server. Check your connection and try again.",
      });
    }
  }

  const isSubmitting = status.tone === "submitting";

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.heading}>Reserve your bag.</h2>
      <p className={styles.lede}>
        There&apos;s no live checkout yet — tell us where to send it and
        we&apos;ll reach out to confirm your order.
      </p>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor={nameId}>
            Full name
          </label>
          <input
            id={nameId}
            className={styles.input}
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Your name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={phoneId}>
            Mobile number
          </label>
          <input
            id={phoneId}
            className={styles.input}
            type="tel"
            name="phone"
            inputMode="tel"
            autoComplete="tel"
            placeholder="98765 43210"
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={emailId}>
          Email address
        </label>
        <input
          id={emailId}
          className={styles.input}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={status.tone === "error"}
          aria-describedby={statusId}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={addressId}>
          Delivery address
        </label>
        <textarea
          id={addressId}
          className={styles.textarea}
          name="address"
          autoComplete="street-address"
          placeholder="House no., street, city, PIN code"
          required
          rows={2}
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />
      </div>

      <Button type="submit" variant="primary" className={styles.submit} disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Reserve my bag"}
      </Button>

      <p
        id={statusId}
        className={styles.status}
        data-tone={status.tone}
        role={status.tone === "error" ? "alert" : "status"}
      >
        {status.tone === "error" || status.tone === "duplicate" ? status.message : ""}
      </p>

      <p className={styles.disclosure}>We&apos;ll only contact you about your Shadow order.</p>
    </form>
  );
}
