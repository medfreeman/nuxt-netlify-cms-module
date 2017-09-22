import { get, generate, generateAfter } from "./nuxt";

describe("module dev mode", () => {
  beforeAll(generate());

  afterAll(generateAfter);

  test("admin", async () => {
    const html = await get("/admin/");
    expect(html).toMatch(/.*<script[\s\S]*?>[\s\S]*?<\/script><\/body>/);
  });
});
