import { get, generate, commonAfter } from "./nuxt";

describe("module generate mode", () => {
  beforeAll(async () => {
    await generate();
  });

  afterAll(async () => {
    await commonAfter();
  });

  test("admin", async () => {
    const html = await get("/admin/");
    expect(html).toMatchSnapshot();
  });
});
