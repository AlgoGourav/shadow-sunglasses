import { supabaseRequest, SupabaseRequestError } from "./supabase-rest.mjs";

export type CartItemSubmission = {
  tintSlug: string;
  packSize: "1" | "3" | "6";
  quantity: number;
};

export type InterestSubmission = {
  name: string;
  email: string;
  phone: string;
  address: string;
  packSize: "1" | "3" | "6";
  colorPreference: string;
  cartItems?: CartItemSubmission[];
  createdAt: string;
};

export async function addInterestSubmission(
  submission: Omit<InterestSubmission, "createdAt">
): Promise<{ status: "created" | "duplicate" }> {
  try {
    await supabaseRequest("waitlist_entries", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        name: submission.name,
        email: submission.email.trim().toLowerCase(),
        phone: submission.phone,
        address: submission.address,
        pack_size: submission.packSize,
        color_preference: submission.colorPreference,
        cart_items: submission.cartItems ?? [],
      }),
    });
  } catch (error) {
    // The unique email constraint also handles simultaneous signups atomically.
    if (error instanceof SupabaseRequestError && error.code === "23505") {
      return { status: "duplicate" };
    }
    throw error;
  }
  return { status: "created" };
}
