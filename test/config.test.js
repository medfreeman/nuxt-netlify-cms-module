/* eslint-disable import/imports-first */
jest.mock("../src/utils/yaml");

import { get, commonBefore, commonAfter } from "./nuxt";

describe("config", () => {
  beforeAll(commonBefore());

  afterAll(commonAfter);

  test("netlify-cms.yml", async () => {
    const config = await get("/admin/config.yml");
    expect(config).toMatchSnapshot();
  });
});
