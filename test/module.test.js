import { get, commonBefore, commonAfter } from "./nuxt";

describe("module", () => {
  beforeAll(async () => {
    await commonBefore();
  });

  afterAll(async () => {
    await commonAfter();
  });

  test("render", async () => {
    const html = await get("/");
    expect(html).toContain("Works!");
  });

  test("admin", async () => {
    const html = await get("/admin/");
    expect(html).toMatchSnapshot();
  });
});
