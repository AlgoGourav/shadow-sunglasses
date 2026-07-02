export type UvRating = "UV400" | "UV380";

export type Tint = {
  slug: string;
  name: string;
  uv: UvRating;
  finish: string;
  bestWorn: string;
  tagline: string;
  description: string;
  mainImage: string;
  detailImage: string;
  detailAlt: string;
  lookbookImage?: string;
  lookbookCaption?: string;
};

export const TINTS: Tint[] = [
  {
    slug: "matte-black",
    name: "Matte Black",
    uv: "UV400",
    finish: "Matte, no mirror",
    bestWorn: "Full sun, every day",
    tagline: "The one that disappears into any frame.",
    description:
      "The tint that reads like it was never anything but sunglasses. Matte Black kills glare without a hint of mirror shine — built for full sun, every day, no explanation needed.",
    mainImage: "/images/product-matte-black-main.png",
    detailImage: "/images/product-matte-black-thumb-1.png",
    detailAlt: "Macro detail of the Matte Black tint film edge on a lens",
    lookbookImage: "/images/lookbook-matte-black.png",
    lookbookCaption: "Matte Black · architectural",
  },
  {
    slug: "deep-navy",
    name: "Deep Navy",
    uv: "UV400",
    finish: "Matte, subtle depth",
    bestWorn: "Full sun, indoor-outdoor",
    tagline: "Almost black, warmer in the light.",
    description:
      "A navy so deep it reads black indoors and blue the moment it hits direct sun. Same UV400 block as Matte Black, with more depth when the light catches it.",
    mainImage: "/images/product-deep-navy-main.png",
    detailImage: "/images/product-deep-navy-thumb-1.png",
    detailAlt: "Macro detail of the Deep Navy tint film edge on a lens",
  },
  {
    slug: "blue-mirror",
    name: "Blue Mirror",
    uv: "UV400",
    finish: "Mirrored",
    bestWorn: "Water, snow, high glare",
    tagline: "Reflective, not decorative.",
    description:
      "A cool mirror finish that cuts glare off water, snow, and pavement alike — the tint built for bright, reflective conditions, not just bright rooms.",
    mainImage: "/images/product-blue-mirror-main.png",
    detailImage: "/images/product-blue-mirror-thumb-1.png",
    detailAlt: "Macro detail of the Blue Mirror tint film edge on a lens",
  },
  {
    slug: "brown-gold",
    name: "Brown Gold",
    uv: "UV400",
    finish: "Warm tint, no mirror",
    bestWorn: "Overcast, golden hour",
    tagline: "Warm contrast, sharper edges.",
    description:
      "Amplifies contrast in low-angle light — golden hour, overcast trails, anywhere flat light needs definition. The warmest tint in the lineup.",
    mainImage: "/images/product-brown-gold-main.png",
    detailImage: "/images/product-brown-gold-thumb-1.png",
    detailAlt: "Macro detail of the Brown Gold tint film edge on a lens",
    lookbookImage: "/images/lookbook-brown-gold.png",
    lookbookCaption: "Brown Gold · coastal evening",
  },
  {
    slug: "forest-green",
    name: "Forest Green",
    uv: "UV400",
    finish: "Classic glass tint",
    bestWorn: "All-day, low eye strain",
    tagline: "Classic glass-green, permanently.",
    description:
      "The tint bar's oldest trick: a true glass-green that's easy on the eyes for hours at a time. UV400, zero mirror, all-day wearable.",
    mainImage: "/images/product-forest-green-main.png",
    detailImage: "/images/product-forest-green-thumb-1.png",
    detailAlt: "Macro detail of the Forest Green tint film edge on a lens",
    lookbookImage: "/images/lookbook-forest-green.png",
    lookbookCaption: "Forest Green · deep in it",
  },
  {
    slug: "rose-pink",
    name: "Rose Pink",
    uv: "UV380",
    finish: "Light tint, no mirror",
    bestWorn: "Overcast, indoor-outdoor",
    tagline: "Soft tint, real block.",
    description:
      "Rose isn't just a look — it's a lighter-transmission tint for overcast days and indoor-to-outdoor moves, still UV380 protected.",
    mainImage: "/images/product-rose-pink-main.png",
    detailImage: "/images/product-rose-pink-thumb-1.png",
    detailAlt: "Macro detail of the Rose Pink tint film edge on a lens",
  },
  {
    slug: "royal-purple",
    name: "Royal Purple",
    uv: "UV380",
    finish: "Saturated tint, no mirror",
    bestWorn: "Statement, everyday",
    tagline: "The tint that gets noticed.",
    description:
      "The boldest color in the lineup. Full saturation, still UV380-rated — proof that a statement tint doesn't have to skip the function.",
    mainImage: "/images/product-royal-purple-main.png",
    detailImage: "/images/product-royal-purple-thumb-1.png",
    detailAlt: "Macro detail of the Royal Purple tint film edge on a lens",
  },
  {
    slug: "aurora-gradient",
    name: "Aurora Gradient",
    uv: "UV380",
    finish: "Gradient, two-tone",
    bestWorn: "Everyday, standout",
    tagline: "One lens, two tones.",
    description:
      "A gradient that shifts from deep magenta to warm gold across the lens — the only tint in the lineup that isn't one color. UV380 protected top to bottom.",
    mainImage: "/images/product-aurora-gradient-main.png",
    detailImage: "/images/product-aurora-gradient-thumb-1.png",
    detailAlt: "Macro detail of the Aurora Gradient tint film edge on a lens",
    lookbookImage: "/images/lookbook-aurora-gradient.png",
    lookbookCaption: "Aurora Gradient · under city light",
  },
];

export function getTint(slug: string): Tint | undefined {
  return TINTS.find((tint) => tint.slug === slug);
}

export function getOtherTints(slug: string, limit?: number): Tint[] {
  const others = TINTS.filter((tint) => tint.slug !== slug);
  return typeof limit === "number" ? others.slice(0, limit) : others;
}
