import { get, generate, generateAfter } from "./nuxt";

describe("module generate mode", async () => {
  beforeAll(async () => {
    await generate()();
  });

  afterAll(async () => {
    await generateAfter();
  });

  test("admin", async () => {
    const html = await get("/admin/");
    expect(html).toMatchSnapshot();
  });
});
