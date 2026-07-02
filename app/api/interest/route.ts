import { NextResponse } from "next/server";
import { addInterestSubmission } from "@/lib/interest-store";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[6-9]\d{9}$/;
const PACK_SIZES = new Set(["1", "3", "6"]);
const TINTS = new Set([
  "matte-black",
  "deep-navy",
  "blue-mirror",
  "brown-gold",
  "forest-green",
  "rose-pink",
  "royal-purple",
  "aurora-gradient",
  "surprise-me",
]);

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "We couldn't read that submission. Please try again." },
      { status: 400 }
    );
  }

  const { name, email, phone, address, packSize, colorPreference, cartItems } = (body ?? {}) as Record<
    string,
    unknown
  >;

  if (typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json(
      { error: "Please enter your full name." },
      { status: 400 }
    );
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json(
      { error: "Email addresses need an @ and a domain. Try: name@example.com" },
      { status: 400 }
    );
  }

  if (typeof phone !== "string" || !PHONE_RE.test(phone.replace(/\s+/g, ""))) {
    return NextResponse.json(
      { error: "Please enter a valid 10-digit Indian mobile number." },
      { status: 400 }
    );
  }

  if (typeof address !== "string" || address.trim().length < 10) {
    return NextResponse.json(
      { error: "Please enter a delivery address we can ship to." },
      { status: 400 }
    );
  }

  if (typeof packSize !== "string" || !PACK_SIZES.has(packSize)) {
    return NextResponse.json(
      { error: "Please choose a pack size." },
      { status: 400 }
    );
  }

  if (typeof colorPreference !== "string" || !TINTS.has(colorPreference)) {
    return NextResponse.json(
      { error: "Please choose a color preference." },
      { status: 400 }
    );
  }

  let validatedCartItems: { tintSlug: string; packSize: "1" | "3" | "6"; quantity: number }[] | undefined;
  if (cartItems !== undefined) {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Your bag looks empty. Add a tint before reserving." },
        { status: 400 }
      );
    }
    validatedCartItems = [];
    for (const entry of cartItems) {
      const { tintSlug, packSize: itemPackSize, quantity } = (entry ?? {}) as Record<string, unknown>;
      if (
        typeof tintSlug !== "string" ||
        !TINTS.has(tintSlug) ||
        tintSlug === "surprise-me" ||
        typeof itemPackSize !== "string" ||
        !PACK_SIZES.has(itemPackSize) ||
        typeof quantity !== "number" ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 20
      ) {
        return NextResponse.json(
          { error: "One of the items in your bag looks invalid. Please refresh and try again." },
          { status: 400 }
        );
      }
      validatedCartItems.push({ tintSlug, packSize: itemPackSize as "1" | "3" | "6", quantity });
    }
  }

  const result = await addInterestSubmission({
    name: name.trim(),
    email: email.trim(),
    phone: phone.replace(/\s+/g, ""),
    address: address.trim(),
    packSize: packSize as "1" | "3" | "6",
    colorPreference,
    ...(validatedCartItems ? { cartItems: validatedCartItems } : {}),
  });

  if (result.status === "duplicate") {
    return NextResponse.json({
      status: "duplicate",
      message: "You already have a reservation with us. We'll be in touch soon.",
    });
  }

  return NextResponse.json({
    status: "created",
    message: "You're confirmed. We'll text and email you about your reservation.",
  });
}
