import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import ts from "typescript";

// Exercise the real route and persistence code without starting Next.js or
// writing fake customer records into the live database.
const require = createRequire(import.meta.url);
async function loadModule(path, replacements) {
  let source = await readFile(new URL(path, import.meta.url), "utf8");
  for (const [from, to] of replacements) source = source.replace(from, to);
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  return `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
}
const storeUrl = await loadModule("../lib/interest-store.ts", [
  ["./supabase-rest.mjs", new URL("../lib/supabase-rest.mjs", import.meta.url).href],
]);
const routeUrl = await loadModule("../app/api/interest/route.ts", [
  ["@/lib/interest-store", storeUrl],
  ["next/server", pathToFileURL(require.resolve("next/server")).href],
]);
const { POST } = await import(routeUrl);
const submission = {
  name: "Test Reservation", email: "TEST@example.com", phone: "98765 43210",
  address: "123 Test Street, Delhi 110001", packSize: "6", colorPreference: "matte-black",
};
const submit = (body) => POST(new Request("https://shadow.example/api/interest", {
  method: "POST", body: JSON.stringify(body),
}));

test("waitlist endpoint", async (t) => {
  const originalUrl = process.env.SUPABASE_URL;
  const originalKey = process.env.SUPABASE_SECRET_KEY;
  t.after(() => {
    if (originalUrl === undefined) delete process.env.SUPABASE_URL;
    else process.env.SUPABASE_URL = originalUrl;
    if (originalKey === undefined) delete process.env.SUPABASE_SECRET_KEY;
    else process.env.SUPABASE_SECRET_KEY = originalKey;
  });
  process.env.SUPABASE_URL = "https://test.supabase.co";
  process.env.SUPABASE_SECRET_KEY = "sb_secret_test";

  await t.test("persists normalized contact details and the complete cart", async (t) => {
    const cartItems = [{ tintSlug: "matte-black", packSize: "6", quantity: 2 }];
    const fetchMock = t.mock.method(globalThis, "fetch", async (url, options) => {
      assert.equal(url.href, "https://test.supabase.co/rest/v1/waitlist_entries");
      assert.equal(options.headers.apikey, "sb_secret_test");
      assert.equal(options.headers.Authorization, undefined);
      const row = JSON.parse(options.body);
      assert.equal(row.email, "test@example.com");
      assert.equal(row.phone, "9876543210");
      assert.deepEqual(row.cart_items, cartItems);
      return new Response(null, { status: 201 });
    });
    const response = await submit({ ...submission, cartItems });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).status, "created");
    assert.equal(fetchMock.mock.callCount(), 1);
  });

  await t.test("database uniqueness conflict returns duplicate without overwriting", async (t) => {
    t.mock.method(globalThis, "fetch", async () => Response.json({ code: "23505" }, { status: 409 }));
    const response = await submit(submission);
    assert.equal((await response.json()).status, "duplicate");
  });

  await t.test("database errors return retryable failure without leaking details", async (t) => {
    t.mock.method(console, "error", () => {});
    t.mock.method(globalThis, "fetch", async () => Response.json({ code: "42501", details: "private data" }, { status: 403 }));
    const response = await submit(submission);
    assert.equal(response.status, 503);
    assert.equal(response.headers.get("retry-after"), "30");
    assert.ok(!(await response.text()).includes("private data"));
  });

  await t.test("missing credentials never accept a reservation", async (t) => {
    t.mock.method(console, "error", () => {});
    const fetchMock = t.mock.method(globalThis, "fetch", async () => { throw new Error("Should not fetch"); });
    delete process.env.SUPABASE_SECRET_KEY;
    assert.equal((await submit(submission)).status, 503);
    assert.equal(fetchMock.mock.callCount(), 0);
    process.env.SUPABASE_SECRET_KEY = "sb_secret_test";
  });

  await t.test("invalid JSON shapes, mobile and cart data are rejected before storage", async (t) => {
    const fetchMock = t.mock.method(globalThis, "fetch", async () => { throw new Error("Should not fetch"); });
    for (const body of [null, [], "hello", { ...submission, phone: "123" },
      { ...submission, cartItems: [{ tintSlug: "matte-black", packSize: "6", quantity: 0 }] }]) {
      assert.equal((await submit(body)).status, 400);
    }
    assert.equal(fetchMock.mock.callCount(), 0);
  });
});
