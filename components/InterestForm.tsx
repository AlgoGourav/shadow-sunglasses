"use client";

import { useId, useState, type FormEvent } from "react";
import Reveal from "./Reveal";
import Button from "./Button";
import FirstHundredBadge from "./FirstHundredBadge";
import styles from "./InterestForm.module.css";
import { PACKS, type PackSize } from "@/lib/pricing";
import { TINTS as TINT_CATALOG } from "@/lib/tints";

const TINTS = [
  { value: "surprise-me", label: "Surprise me" },
  ...TINT_CATALOG.map((tint) => ({ value: tint.slug, label: tint.name })),
];

type Status =
  | { tone: "idle" }
  | { tone: "submitting" }
  | { tone: "success"; message: string }
  | { tone: "duplicate"; message: string }
  | { tone: "error"; message: string };

export default function InterestForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [packSize, setPackSize] = useState<PackSize>("3");
  const [colorPreference, setColorPreference] = useState("surprise-me");
  const [status, setStatus] = useState<Status>({ tone: "idle" });
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const addressId = useId();
  const colorId = useId();
  const statusId = useId();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ tone: "submitting" });

    try {
      const response = await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, address, packSize, colorPreference }),
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
      setEmail("");
    } catch {
      setStatus({
        tone: "error",
        message: "We couldn't reach the server. Check your connection and try again.",
      });
    }
  }

  const isSubmitting = status.tone === "submitting";
  const isDone = status.tone === "success";

  return (
    <section id="signup" className={styles.section}>
      <div className={`container ${styles.layout}`}>
        <Reveal>
          <p className={`mono-label ${styles.goal}`}>
            Be one of the first <FirstHundredBadge /> to reserve
          </p>
          <h2 className={styles.heading}>Shop Shadow.</h2>
          <p className={styles.lede}>
            Pick your pack and tint, and tell us where to send it.
          </p>
        </Reveal>

        <Reveal delayStep={1}>
          {isDone ? (
            <p className={styles.status} data-tone="success" role="status">
              {status.message}
            </p>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
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

              <div className={styles.field}>
                <span className={styles.label}>Pack size</span>
                <div className={styles.packGrid} role="radiogroup" aria-label="Pack size">
                  {PACKS.map((pack) => (
                    <label key={pack.value} className={styles.packOption}>
                      <input
                        type="radio"
                        name="packSize"
                        value={pack.value}
                        checked={packSize === pack.value}
                        onChange={() => setPackSize(pack.value)}
                      />
                      <span className={styles.packCard}>
                        <span className={styles.packLabel}>{pack.label}</span>
                        <span className={`mono-label ${styles.packPrice}`}>
                          {pack.priceLabel}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor={colorId}>
                  First tint you&apos;d want
                </label>
                <select
                  id={colorId}
                  className={styles.select}
                  value={colorPreference}
                  onChange={(event) => setColorPreference(event.target.value)}
                >
                  {TINTS.map((tint) => (
                    <option key={tint.value} value={tint.value}>
                      {tint.label}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                type="submit"
                variant="primary"
                className={styles.submit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending…" : "Reserve my Shades"}
              </Button>

              <p
                id={statusId}
                className={styles.status}
                data-tone={status.tone}
                role={status.tone === "error" ? "alert" : "status"}
              >
                {status.tone === "error" || status.tone === "duplicate"
                  ? status.message
                  : ""}
              </p>

              <p className={styles.disclosure}>
                We&apos;ll only contact you about your Shadow order.
              </p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
