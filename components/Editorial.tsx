import Image from "next/image";
import Reveal from "./Reveal";
import styles from "./Editorial.module.css";

const shots = [
  {
    image: "/images/lookbook-brown-gold.png",
    caption: "Brown Gold · coastal evening",
    alt: "Brown Gold Shadow tint worn at golden hour above a coastal town",
    width: 941, height: 1672,
  },
  {
    image: "/images/lookbook-golden-hour.png",
    caption: "Golden hour, anywhere",
    alt: "Warm mirrored Shadow tint catching the sunset",
    width: 941, height: 1672,
  },
  {
    image: "/images/lookbook-forest-green.png",
    caption: "Forest Green · deep in it",
    alt: "Forest Green Shadow tint worn in a misty forest",
    width: 941, height: 1672,
  },
  {
    image: "/images/lookbook-matte-black.png",
    caption: "Matte Black · architectural",
    alt: "Matte Black Shadow tint worn against concrete architecture",
    width: 941, height: 1672,
  },
  {
    image: "/images/lookbook-aurora-gradient.png",
    caption: "Aurora Gradient · under city light",
    alt: "Aurora Gradient Shadow tint reflecting neon city light",
    width: 1023, height: 1537,
  },
];

export default function Editorial() {
  return (
    <section className={`${styles.section} container`}>
      <Reveal>
        <span className={`hand-accent ${styles.overline}`}>
          Your call, every time
        </span>
        <h2 className={styles.heading}>Every tint, in its own light.</h2>
      </Reveal>

      <ul className={styles.grid}>
        {shots.map((shot, i) => (
          <Reveal
            as="li"
            key={shot.image}
            delayStep={i + 1}
            className={styles.item}
          >
            <Image
              src={shot.image}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              sizes="(min-width: 720px) 45vw, 90vw"
              loading="lazy"
            />
            <span className={`mono-label ${styles.caption}`}>{shot.caption}</span>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
