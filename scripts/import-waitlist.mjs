import { readFile } from "node:fs/promises";
import { supabaseRequest } from "../lib/supabase-rest.mjs";

// Explicit, one-time import. The source file is left intact for recovery.
const entries = JSON.parse(await readFile(new URL("../data/interest-submissions.json", import.meta.url), "utf8"));
if (!Array.isArray(entries)) throw new Error("Expected a list of submissions");
for (const entry of entries) {
  await supabaseRequest("waitlist_entries?on_conflict=email", {
    method: "POST",
    headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
    body: JSON.stringify({
      name: entry.name,
      email: entry.email.trim().toLowerCase(),
      phone: entry.phone.replace(/\s+/g, ""),
      address: entry.address,
      pack_size: entry.packSize,
      color_preference: entry.colorPreference,
      cart_items: entry.cartItems ?? [],
      ...(entry.createdAt ? { created_at: entry.createdAt } : {}),
    }),
  });
}
console.log(`Processed ${entries.length} submissions. Existing emails were preserved.`);
