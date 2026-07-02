export type PackSize = "1" | "3" | "6";

export type Pack = {
  value: PackSize;
  label: string;
  price: number;
  priceLabel: string;
};

export const PACKS: Pack[] = [
  { value: "1", label: "1-pack", price: 59, priceLabel: "₹59" },
  { value: "3", label: "3-pack", price: 129, priceLabel: "₹129" },
  { value: "6", label: "6-pack", price: 179, priceLabel: "₹179" },
];

export function getPack(value: PackSize): Pack {
  return PACKS.find((pack) => pack.value === value) ?? PACKS[1];
}

export function formatPrice(amount: number): string {
  return `₹${amount}`;
}
