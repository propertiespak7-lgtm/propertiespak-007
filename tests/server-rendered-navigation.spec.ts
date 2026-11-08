import { test, expect } from "@playwright/test";

test("listing choice is present in the initial server HTML", async ({ request }) => {
  const response = await request.get("/list-property");
  expect(response.status()).toBe(200);
  const html = await response.text();
  // Do not count the serialized RSC data embedded in scripts as rendered HTML.
  const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  expect(markup).toContain("Apni Property Ka Ad Lagayein");
  expect(markup).toContain("Sell My Property");
  expect(markup).toContain("Rent Out Property");
  expect(markup).not.toContain("Loading content");
});

test("search renders property cards in server HTML and referenced scripts are served", async ({ request }) => {
  for (const path of ["/list-property", "/properties"]) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    const html = await response.text();
    const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
    if (path === "/properties") {
      expect(markup).toContain("property-card");
      expect(markup).not.toContain("Loading content");
    }
    const scripts = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/gi)];
    expect(scripts.length).toBeGreaterThan(0);
    for (const [, src] of scripts) {
      expect((await request.get(src.replaceAll("&amp;", "&"))).status(), src).toBe(200);
    }
  }
});
