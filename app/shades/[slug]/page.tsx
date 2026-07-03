import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import ProductGallery from "@/components/shades/ProductGallery";
import PurchasePanel from "@/components/shades/PurchasePanel";
import RelatedTints from "@/components/shades/RelatedTints";
import { TINTS, getTint } from "@/lib/tints";
import styles from "./page.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return TINTS.map((tint) => ({ slug: tint.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const tint = getTint(slug);
    if (!tint) return {};
    const title = `${tint.name} | Shadow`;
    return {
      title,
      description: tint.description,
      openGraph: { title, description: tint.description, images: [{ url: tint.mainImage }] },
    };
  });
}

export default async function ShadeDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tint = getTint(slug);
  if (!tint) notFound();

  const specRows = [
    { label: "UV rating", value: tint.uv },
    { label: "Finish", value: tint.finish },
    { label: "Best worn", value: tint.bestWorn },
    { label: "Material", value: "Optical-grade polymer film, 0.1mm" },
  ];

  return (
    <main id="main-content">
      <div className={`container ${styles.wrap}`}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/#colors">← All tints</Link>
        </nav>

        <div className={styles.layout}>
          <Reveal className={styles.galleryCol}>
            <ProductGallery tint={tint} />
          </Reveal>

          <div className={styles.infoCol}>
            <Reveal>
              <div className={styles.badgeRow}>
                <span
                  className={styles.dot}
                  style={{ background: `var(--tint-${tint.slug})` }}
                  aria-hidden="true"
                />
                <span className={`mono-label ${styles.uv}`}>{tint.uv}</span>
              </div>
              <h1 className={styles.name}>{tint.name}</h1>
              <p className={styles.tagline}>{tint.tagline}</p>
            </Reveal>

            <Reveal delayStep={1}>
              <p className={styles.description}>{tint.description}</p>
            </Reveal>

            <Reveal delayStep={2}>
              <PurchasePanel tint={tint} />
            </Reveal>

            <Reveal delayStep={3}>
              <span className={`hand-accent ${styles.specsOverline}`}>
                The real numbers
              </span>
              <ul className={styles.specs}>
                {specRows.map((spec) => (
                  <li key={spec.label} className={styles.spec}>
                    <span className={`mono-label ${styles.specLabel}`}>{spec.label}</span>
                    <span className={styles.specValue}>{spec.value}</span>
                  </li>
                ))}
              </ul>
              <Link href="/#specs" className={styles.specsLink}>
                Full spec sheet →
              </Link>
            </Reveal>
          </div>
        </div>
      </div>

      <RelatedTints currentSlug={tint.slug} />
    </main>
  );
}
