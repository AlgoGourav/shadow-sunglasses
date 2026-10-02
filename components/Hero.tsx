import styles from "./Hero.module.css";
import Button from "./Button";
import LensDemo from "./LensDemo";

export default function Hero() {
  return (
    <section id="top" className={styles.hero}>
      <LensDemo>
      <div className={styles.content}>
        <h1 className={styles.headline}>
          Turn any glasses into sunglasses.
        </h1>
        <p className={styles.sub}>
          Peelable tint for lens.
        </p>
        <div className={styles.actions}>
          <Button href="#signup" variant="primary">
            Shop now
          </Button>
          <Button href="#how-it-works" variant="ghost">
            how to apply
          </Button>
        </div>
      </div>
      </LensDemo>
    </section>
  );
}
