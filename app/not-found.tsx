import Button from "@/components/Button";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main id="main-content" className={styles.section}>
      <div className={`container ${styles.wrap}`}>
        <span className={`mono-label ${styles.code}`}>404</span>
        <h1 className={styles.heading}>That tint doesn&apos;t exist.</h1>
        <p className={styles.lede}>
          The page you&apos;re looking for isn&apos;t one of ours. Check the
          link, or head back to the full lineup.
        </p>
        <div className={styles.actions}>
          <Button href="/#colors" variant="primary">
            Browse tints
          </Button>
          <Button href="/" variant="ghost">
            Back home
          </Button>
        </div>
      </div>
    </main>
  );
}
