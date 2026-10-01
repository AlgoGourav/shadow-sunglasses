/** Shared aperture geometry in the locked 1672 x 941 studio photo.
 * The film flattens to the same lens perimeter, rather than fitting two
 * independently generated silhouettes through arbitrary scaling.
 */
import { APERTURES } from "./lens-apertures";
export const SCENE = { width: 1672, height: 941 };
type Point = readonly [number, number];
type Lens = { minX: number; width: number; lift: Point };
export const LENSES: readonly Lens[] = [
  { minX: 194, width: 350, lift: [-160,120] },
  { minX: 651, width: 519, lift: [100,-130] },
];
export function aperturePath(index: number, flex = 0): string {
  const lens = LENSES[index];
  const point = ([x,y]: Point) => {
    const bow = Math.sin(((x-lens.minX)/lens.width)*Math.PI*2)*28*flex;
    return `${x.toFixed(2)},${(y+bow).toFixed(2)}`;
  };
  return `${APERTURES[index].map((p,i) => `${i===0 ? "M" : "L"}${point(p)}`).join(" ")}Z`;
}
export function sceneMaterial(slug: string): string {
  return `/images/hero-optical-${slug === "blue-mirror" ? "blue" : slug}.webp`;
}
