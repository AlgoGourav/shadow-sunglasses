import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.top}`}>
        <div>
          <p className={styles.mark}>SHADOW</p>
          <p className={styles.tagline}>
            Peelable lens tints for the glasses you already own.
          </p>
        </div>
        <ul className={styles.links}>
          <li>
            <Link href="/#how-it-works">How it works</Link>
          </li>
          <li>
            <Link href="/#colors">Colors</Link>
          </li>
          <li>
            <Link href="/#specs">Specs</Link>
          </li>
          <li>
            <Link href="/cart">Bag</Link>
          </li>
          <li>
            <Link href="/#signup">Shop now</Link>
          </li>
        </ul>
      </div>
      <div className={`container ${styles.bottom}`}>
        <p className="mono-label">© {new Date().getFullYear()} Shadow</p>
        <p className="mono-label">UV400 · Made to peel</p>
      </div>
    </footer>
  );
}
