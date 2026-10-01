"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Button from "./Button";
import { TINTS } from "@/lib/tints";
import { aperturePath, LENSES, SCENE, sceneMaterial } from "@/lib/lens-scene";
import styles from "./LensDemo.module.css";

const clamp = (n: number) => Math.min(1, Math.max(0, n));
const smooth = (n: number) => { const p = clamp(n); return p*p*(3-2*p); };
const STAGES = ["Separate film", "Align to the rim", "Apply film", "Finished"];
async function loadImage(src: string) {
  const image = new window.Image();
  image.src = src;
  await image.decode();
}

export default function LensDemo({ children }: { children: ReactNode }) {
  const id = useId().replace(/:/g, "");
  const root = useRef<HTMLDivElement>(null);
  const sequence = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLElement>(null);
  const groups = useRef<(SVGGElement | null)[]>([]);
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const value = useRef(1);
  const reduced = useRef(true);
  const busyRef = useRef(false);
  const manual = useRef(false);
  const active = useRef(true);
  const animation = useRef(0);
  const finishAnimation = useRef<((done: boolean) => void) | null>(null);
  const selectionVersion = useRef(0);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState("blue-mirror");
  const [phase, setPhase] = useState(3);
  const [error, setError] = useState("");
  const tint = TINTS.find(tint => tint.slug === selected)!;

  function paint(progress: number) {
    const p = clamp(progress);
    value.current = p;
    // Approach, hold just off the glass, then make contact in a separate beat.
    const approach = p < 0.55 ? smooth((p-0.18)/0.27)*0.55 : 0.55+smooth((p-0.55)/0.28)*0.45;
    const loose = 1-approach;
    LENSES.forEach((lens,i) => {
      groups.current[i]?.setAttribute("transform", `translate(${lens.lift[0]*loose} ${lens.lift[1]*loose})`);
      paths.current[i]?.setAttribute("d", aperturePath(i,loose));
    });
    root.current?.style.setProperty("--film-loose", String(loose));
    root.current?.style.setProperty("--demo-progress", `${p*100}%`);
    // Fitted reflections only appear after the film is flat and stationary;
    // otherwise photographed rim details would travel with the loose film.
    root.current?.style.setProperty("--film-seated", String(smooth((p-0.83)/0.06)));
    root.current?.style.setProperty("--film-annotations", String(1-smooth((p-0.5)/0.12)));
    root.current?.style.setProperty("--fit-annotations", String(smooth((p-0.89)/0.06)));
    const next = p < 0.22 ? 0 : p < 0.55 ? 1 : p < 0.9 ? 2 : 3;
    setPhase(current => current === next ? current : next);
  }

  useEffect(() => {
    active.current = true;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let loaded = false;
    const node = root.current!;
    const update = () => {
      frame = 0;
      if (manual.current || busyRef.current || !loaded || reduced.current) return;
      const host = window.innerWidth < 1000 ? sequence.current! : node;
      const navHeight = document.querySelector("body > header")?.getBoundingClientRect().height ?? 80;
      const offset = navHeight+16;
      node.style.setProperty("--hero-offset", `${offset}px`);
      const travel = Math.max(1, host.offsetHeight-stage.current!.offsetHeight);
      paint((offset-host.getBoundingClientRect().top)/travel);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const onScroll = () => { manual.current = false; schedule(); };
    const configure = () => {
      reduced.current = preference.matches;
      node.dataset.motion = String(loaded && !preference.matches);
      if (preference.matches) { cancelAnimationFrame(animation.current); finishAnimation.current?.(false); paint(1); }
      else schedule();
    };
    Promise.all([loadImage("/images/hero-optical-clear.webp"), loadImage(sceneMaterial("blue-mirror")), loadImage("/images/hero-film-materials.webp")])
      .then(() => {
        if (!active.current) return;
        loaded = true;
        setReady(true);
        configure();
      }).catch(() => {
        // The complete poster remains if any layer fails to load.
        if (active.current) setError("The interactive preview couldn't load. You can still explore all eight tints below.");
      });
    window.addEventListener("scroll",onScroll,{passive:true});
    window.addEventListener("resize",schedule);
    preference.addEventListener("change",configure);
    configure();
    return () => {
      active.current = false;
      if (frame) cancelAnimationFrame(frame);
      cancelAnimationFrame(animation.current);
      finishAnimation.current?.(false);
      window.removeEventListener("scroll",onScroll);
      window.removeEventListener("resize",schedule);
      preference.removeEventListener("change",configure);
    };
  },[]);

  function animateTo(target: number): Promise<boolean> {
    cancelAnimationFrame(animation.current);
    finishAnimation.current?.(false);
    if (reduced.current) { paint(target); return Promise.resolve(true); }
    const from = value.current;
    let start: number | null = null;
    return new Promise(resolve => {
      finishAnimation.current = resolve;
      const tick = (now: number) => {
        if (!active.current) { resolve(false); return; }
        start ??= now;
        const elapsed = clamp((now-start)/550);
        paint(from+(target-from)*smooth(elapsed));
        if (elapsed < 1) animation.current = requestAnimationFrame(tick);
        else { finishAnimation.current = null; resolve(true); }
      };
      animation.current = requestAnimationFrame(tick);
    });
  }

  function showStage(index: number) {
    if (busyRef.current) return;
    manual.current = true;
    void animateTo([0,0.46,0.69,1][index]);
  }

  async function chooseTint(slug: string) {
    if (slug === selected || busyRef.current) return;
    const version = ++selectionVersion.current;
    busyRef.current = true;
    manual.current = true;
    setBusy(true);
    setError("");
    try {
      await loadImage(sceneMaterial(slug));
      if (!active.current || version !== selectionVersion.current) return;
      // The old film retires before a fresh material is introduced.
      await animateTo(0);
      if (!active.current || version !== selectionVersion.current) return;
      groups.current.forEach(group => group?.setAttribute("opacity","0"));
      setSelected(slug);
      // Let React commit the new raster and atlas window before application.
      await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      if (!active.current || version !== selectionVersion.current) return;
      groups.current.forEach(group => group?.setAttribute("opacity","1"));
      await animateTo(1);
    } catch {
      if (active.current) setError("This tint preview couldn't load. Your current tint is still shown. Please try again.");
    } finally {
      busyRef.current = false;
      if (active.current) setBusy(false);
    }
  }

  const materialIndex = TINTS.findIndex(item => item.slug === selected);
  return (
    <div ref={root} className={`${styles.layout} container`} data-ready={ready}>
      <div className={styles.intro}>{children}</div>
      <div ref={sequence} className={styles.sequence}>
        <figure ref={stage} className={styles.stage} aria-label="Shadow film application demonstration">
          <div className={styles.scene}>
            <Image className={styles.poster} src="/images/hero-optical-blue.webp" alt="Blue Mirror film covering the full front surface of both prescription lenses in the same silver glasses" fill priority sizes="(min-width: 1000px) 60vw, 100vw" />
            <svg className={styles.optical} viewBox={`0 0 ${SCENE.width} ${SCENE.height}`} role="img" aria-labelledby={`${id}-title`}>
              <title id={`${id}-title`}>{`Pre-cut ${tint.name} adhesive films apply to the front of existing prescription lenses, covering them to the rim.`}</title>
              <defs>{LENSES.map((_,i) => <clipPath key={i} id={`${id}-film-${i}`}><path ref={node => { paths.current[i]=node; }} d={aperturePath(i)} /></clipPath>)}</defs>
              <image href="/images/hero-optical-clear.webp" width={SCENE.width} height={SCENE.height} />
              {LENSES.map((lens,i) => (
                <g key={i} ref={node => { groups.current[i]=node; }} className={styles.film}>
                  <g clipPath={`url(#${id}-film-${i})`}>
                    <svg x={lens.minX-25} y={i===0 ? 210 : 290} width={lens.width+50} height={i===0 ? 430 : 510} viewBox={`${[2,446,889,1333][materialIndex%4]} ${materialIndex<4 ? 2 : 444} 439 437`} preserveAspectRatio="none" className={styles.looseMaterial}>
                      <image href="/images/hero-film-materials.webp" width="1774" height="887" preserveAspectRatio="none" />
                    </svg>
                    <image className={styles.seatedMaterial} href={sceneMaterial(selected)} width={SCENE.width} height={SCENE.height} />
                    <path className={styles.flexGlint} d={i===0 ? "M207 320 Q335 480 512 458" : "M669 410 Q865 626 1148 606"} />
                  </g>
                </g>
              ))}
            </svg>
            <div className={`${styles.annotation} ${styles.filmLabel}`} aria-hidden="true"><span>Thin adhesive film</span><i /></div>
            <div className={`${styles.annotation} ${styles.lensLabel}`} aria-hidden="true"><i /><span>Your prescription lens</span></div>
            <div className={`${styles.annotation} ${styles.fitLabel}`} aria-hidden="true"><span>Full coverage. Same frame.</span><i /></div>
          </div>
          <div className={styles.progress} aria-hidden="true"><span /></div>
          <figcaption className={styles.caption}>
            <div className={styles.stageCopy}>
              <p className={styles.captionTitle}>{String(phase+1).padStart(2,"0")} / 04 · {STAGES[phase]}</p>
              <p className={styles.captionDetail}>{phase===0 ? "Pre-cut to your lens. Thin, flexible, adhesive." : phase===1 ? "Match the edges. The clear lens stays in the frame." : phase===2 ? "The film settles onto the front surface, all the way to the rim." : "Your prescription stays. Your glasses become sunglasses."}</p>
            </div>
            <div className={styles.stages} role="group" aria-label="View application stages">{STAGES.map((label,i) => <Button key={label} variant="ghost" className={styles.stageButton} aria-label={label} title={label} aria-pressed={phase===i} disabled={!ready} aria-disabled={busy} onClick={() => showStage(i)}>{i+1}</Button>)}</div>
          </figcaption>
          <div className={styles.tints}>
            <div className={styles.tintHeading}><span>Same frame. Fresh tint.</span><span className={styles.tintName}>{tint.name} · {tint.uv}</span></div>
            <div className={styles.swatches} role="group" aria-label="Choose a fresh film tint">{TINTS.map(item => <Button key={item.slug} variant="ghost" className={styles.swatch} aria-label={`Preview ${item.name}`} title={item.name} aria-pressed={selected===item.slug} disabled={!ready} aria-disabled={busy} onClick={() => void chooseTint(item.slug)}><span style={{background:`var(--tint-${item.slug})`}} /><span className="visually-hidden">{item.name}</span></Button>)}</div>
            <p className={styles.replacement} role="status" aria-live="polite">{busy ? "Replacing with a fresh film…" : "Peel off to remove. Apply a new film for your next tint."}</p>
            {error && <p className={styles.error} role="status">{error}</p>}
          </div>
        </figure>
      </div>
    </div>
  );
}
