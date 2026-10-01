import Image from "next/image";
import Reveal from "./Reveal";
import styles from "./HowItWorks.module.css";

const steps = [
  {
    n: "01",
    title: "Clean",
    text: "Wipe the lens with the included cloth so the tint bonds evenly.",
    image: "/images/step-1-clean.png",
    alt: "Cleaning a glasses lens with a microfiber cloth",
  },
  {
    n: "02",
    title: "Peel",
    text: "Lift one tint from the sheet. No tools, no mess.",
    image: "/images/step-2-peel-v2.webp",
    alt: "Peeling a pre-cut lens-shaped tint film off its backing sheet",
  },
  {
    n: "03",
    title: "Align",
    text: "Set it on the front of the lens and smooth it out from the center.",
    image: "/images/step-3-half-applied.webp",
    alt: "Half of the blue film is applied to the front lens, with the remaining half lifted for smoothing",
  },
  {
    n: "04",
    title: "Finish",
    text: "Smooth the film to the rim. Your clear prescription lens stays underneath.",
    image: "/images/step-4-finished.webp",
    alt: "Finished blue tint film seated flat across the full lens surface to the inner rim",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className={styles.section}>
      <div className="container">
        <Reveal>
          <h2 className={styles.heading}>
            Four steps.{" "}
            <span className={`hand-accent ${styles.accent}`}>No tools.</span>
          </h2>
          <p className={styles.lede}>
            Applying and removing Shadow takes less time than cleaning your
            glasses does.
          </p>
        </Reveal>

        <ol className={styles.steps}>
          {steps.map((step, i) => (
            <Reveal as="li" key={step.n} delayStep={i + 1} className={styles.step}>
              <span className={styles.index} aria-hidden="true">{step.n}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepText}>{step.text}</p>
              <div className={styles.frame}>
                <Image
                  src={step.image}
                  alt={step.alt}
                  fill
                  sizes="(min-width: 1040px) 23vw, (min-width: 720px) 46vw, 90vw"
                  loading="lazy"
                />
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
