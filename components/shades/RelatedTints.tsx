import Image from "next/image";
import Link from "next/link";
import Reveal from "../Reveal";
import styles from "./RelatedTints.module.css";
import { getOtherTints } from "@/lib/tints";

export default function RelatedTints({ currentSlug }: { currentSlug: string }) {
  const others = getOtherTints(currentSlug);

  return (
    <section className={`${styles.section} container`}>
      <Reveal>
        <h2 className={styles.heading}>The rest of the lineup.</h2>
      </Reveal>

      <ul className={styles.grid}>
        {others.map((tint, i) => (
          <Reveal as="li" key={tint.slug} delayStep={(i % 4) + 1}>
            <Link href={`/shades/${tint.slug}`} className={styles.card}>
              <div className={styles.frame}>
                <Image
                  src={tint.mainImage}
                  alt={`${tint.name} Shadow tint applied to glasses`}
                  fill
                  sizes="(min-width: 1040px) 22vw, (min-width: 640px) 30vw, 45vw"
                  loading="lazy"
                />
              </div>
              <div className={styles.meta}>
                <span
                  className={styles.dot}
                  style={{ background: `var(--tint-${tint.slug})` }}
                  aria-hidden="true"
                />
                <span className={styles.name}>{tint.name}</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
