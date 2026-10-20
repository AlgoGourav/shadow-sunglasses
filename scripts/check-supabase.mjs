import { supabaseRequest, SupabaseRequestError } from "../lib/supabase-rest.mjs";

try {
  const response = await supabaseRequest("rpc/check_waitlist_health", {
    method: "POST",
    body: "{}",
  });
  const checkedAt = await response.json();
  if (typeof checkedAt !== "string" || Number.isNaN(Date.parse(checkedAt))) {
    throw new Error("Invalid health check response");
  }
  console.log(`Supabase database check succeeded at ${checkedAt}`);
} catch (error) {
  console.error("Supabase database check failed.", error instanceof SupabaseRequestError
    ? `Status: ${error.status}; code: ${error.code ?? "unknown"}`
    : "Check connectivity and project status.");
  process.exitCode = 1;
}
