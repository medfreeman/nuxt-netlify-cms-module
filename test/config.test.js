/* eslint-disable import/first */
jest.mock("../src/utils/yaml");

import { get, commonBefore, commonAfter } from "./nuxt";

describe("config", () => {
  beforeAll(async () => {
    await commonBefore();
  });

  afterAll(async () => {
    await commonAfter();
  });

  test("netlify-cms.yml", async () => {
    const config = await get("/admin/config.yml");
    expect(config).toMatchSnapshot();
  });
});
