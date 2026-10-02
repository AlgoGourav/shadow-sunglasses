import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import styles from "./ColorLineup.module.css";
import { TINTS } from "@/lib/tints";
import { sceneMaterial } from "@/lib/lens-scene";

export default function ColorLineup() {
  return (
    <section id="colors" className={`${styles.section} container`}>
      <Reveal>
        <h2 className={styles.heading}>Any frame</h2>
        <p className={styles.lede}>
          Every tint is the same peelable film. Pick a mood,{" "}
          <span className={styles.accent}>
            swap it
            <svg
              className={styles.accentUnderline}
              viewBox="0 0 120 14"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d="M2 9C22 3 45 2 60 5C78 8.5 100 4 118 7" />
            </svg>
          </span>{" "}
          whenever you want the next one.
        </p>
      </Reveal>

      <ul className={styles.grid}>
        {TINTS.map((tint, i) => (
          <Reveal as="li" key={tint.slug} delayStep={(i % 4) + 1} className={styles.card}>
            <Link href={`/shades/${tint.slug}`} className={styles.cardLink}>
              <div className={styles.frame}>
                <Image
                  src={sceneMaterial(tint.slug)}
                  alt={`${tint.name} Shadow tint applied to glasses`}
                  fill
                  sizes="(min-width: 1040px) 22vw, (min-width: 640px) 30vw, 90vw"
                  loading="lazy"
                />
              </div>
              <div className={styles.meta}>
                <span
                  className={styles.dot}
                  style={{
                    background: `var(--tint-${tint.slug})`,
                  }}
                  aria-hidden="true"
                />
                <span className={styles.name}>{tint.name}</span>
                <span className={`mono-label ${styles.uv}`}>{tint.uv}</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
