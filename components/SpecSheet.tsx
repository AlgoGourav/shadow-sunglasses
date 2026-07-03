import Image from "next/image";
import Reveal from "./Reveal";
import styles from "./SpecSheet.module.css";

const specs = [
  { label: "UV protection", value: "100% UVA/UVB, UV400" },
  { label: "Material", value: "Optical-grade polymer film, 0.1mm" },
  { label: "Fit", value: "Universal, trim-to-fit for any lens shape" },
  { label: "Adhesive", value: "Residue-free, reusable up to 20 applications" },
  { label: "Coating", value: "Scratch-resistant" },
  { label: "Removal time", value: "Under 10 seconds" },
];

export default function SpecSheet() {
  return (
    <section id="specs" className={`${styles.section} container`}>
      <div className={styles.layout}>
        <div>
          <Reveal>
            <span className={`hand-accent ${styles.overline}`}>
              Unbelievably true
            </span>
            <h2 className={styles.heading}>UV400 protection, full stop.</h2>
            <p className={styles.lede}>
              Shadow blocks UV the same way a ₹15,000 pair of sunglasses
              does. <span className="hand-accent">(Try for yourself.)</span>{" "}
              The film is 0.1mm thick, and the color is the only thing
              you&apos;re paying to change.
            </p>
          </Reveal>

          <Reveal delayStep={1}>
            <ul className={styles.specs}>
              {specs.map((spec) => (
                <li key={spec.label} className={styles.spec}>
                  <span className={`mono-label ${styles.specLabel}`}>
                    {spec.label}
                  </span>
                  <span className={`${styles.specValue}`}>{spec.value}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delayStep={2} className={styles.visual}>
          <Image
            src="/images/ui-placeholder.png"
            alt="Schematic outline of an aviator frame, representing Shadow's universal fit"
            fill
            sizes="(min-width: 900px) 40vw, 90vw"
            loading="lazy"
          />
        </Reveal>
      </div>
    </section>
  );
}
