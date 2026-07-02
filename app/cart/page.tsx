import type { Metadata } from "next";
import CartView from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Your bag | Shadow",
  description: "Review your Shadow tints and reserve your order.",
};

export default function CartPage() {
  return <CartView />;
}
