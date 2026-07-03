import Image from "next/image";
import styles from "./Hero.module.css";
import Button from "./Button";
import HandUnderline from "./HandUnderline";

export default function Hero() {
  return (
    <section id="top" className={styles.hero}>
      <div className={styles.image}>
        <Image
          src="/images/ui-hero-bg.png"
          alt="Sunglasses with a peelable shadow-web tint resting on a car dashboard at dusk"
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className={styles.scrim} aria-hidden="true" />
      <div className={`${styles.content} container`}>
        <p className={`mono-label ${styles.eyebrow}`}>Fits any glasses you already own</p>
        <h1 className={styles.headline}>
          Turn any glasses into sunglasses.
        </h1>
        <p className={styles.sub}>
          Shadow is a peelable lens tint that sticks to the lens you already
          have.{" "}
          <span className={styles.claim}>
            <HandUnderline mode="replay">
              Real UV protection, not a filter.
            </HandUnderline>
          </span>{" "}
          Peel it off whenever you want the next color.
        </p>
        <div className={styles.actions}>
          <Button href="#signup" variant="onDark">
            Shop now
          </Button>
          <Button href="#how-it-works" variant="ghostOnDark">
            See how it works
          </Button>
        </div>
        <p className={styles.note}>8 tints available · swap in a new one anytime</p>
      </div>
    </section>
  );
}
