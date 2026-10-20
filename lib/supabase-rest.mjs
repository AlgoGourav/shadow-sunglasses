// Server and maintenance scripts only. Never import this module into client components.
export class SupabaseRequestError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = "SupabaseRequestError";
    this.status = status;
    this.code = code;
  }
}

export async function supabaseRequest(path, options = {}) {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !key) {
    throw new SupabaseRequestError("Supabase is not configured", 503, "NOT_CONFIGURED");
  }

  const base = new URL(url);
  if (base.protocol !== "https:") {
    throw new SupabaseRequestError("Supabase URL must use HTTPS", 503, "INVALID_CONFIG");
  }

  const response = await fetch(new URL(`/rest/v1/${path}`, base), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      apikey: key,
      // Legacy service_role keys require Authorization; sb_secret keys use apikey.
      ...(key.startsWith("sb_secret_") ? {} : { Authorization: `Bearer ${key}` }),
    },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    // Do not surface Postgres details: they can include submitted personal data.
    throw new SupabaseRequestError("Supabase request failed", response.status, error.code);
  }

  return response;
}
