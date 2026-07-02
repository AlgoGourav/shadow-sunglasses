"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PACKS, type PackSize } from "./pricing";

export type CartItem = {
  tintSlug: string;
  packSize: PackSize;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  hydrated: boolean;
  addItem: (tintSlug: string, packSize: PackSize, quantity?: number) => void;
  updateQuantity: (tintSlug: string, packSize: PackSize, quantity: number) => void;
  removeItem: (tintSlug: string, packSize: PackSize) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "shadow-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) {
          // One-time hydration from localStorage on mount (not a render-loop sync).
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setItems(parsed);
        }
      }
    } catch {
      // corrupt or inaccessible storage — start with an empty cart
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback(
    (tintSlug: string, packSize: PackSize, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find(
          (item) => item.tintSlug === tintSlug && item.packSize === packSize
        );
        if (existing) {
          return prev.map((item) =>
            item === existing
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { tintSlug, packSize, quantity }];
      });
    },
    []
  );

  const updateQuantity = useCallback(
    (tintSlug: string, packSize: PackSize, quantity: number) => {
      setItems((prev) =>
        quantity <= 0
          ? prev.filter(
              (item) => !(item.tintSlug === tintSlug && item.packSize === packSize)
            )
          : prev.map((item) =>
              item.tintSlug === tintSlug && item.packSize === packSize
                ? { ...item, quantity }
                : item
            )
      );
    },
    []
  );

  const removeItem = useCallback((tintSlug: string, packSize: PackSize) => {
    setItems((prev) =>
      prev.filter((item) => !(item.tintSlug === tintSlug && item.packSize === packSize))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const pack = PACKS.find((p) => p.value === item.packSize);
        return sum + (pack ? pack.price * item.quantity : 0);
      }, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({ items, itemCount, subtotal, hydrated, addItem, updateQuantity, removeItem, clear }),
    [items, itemCount, subtotal, hydrated, addItem, updateQuantity, removeItem, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
