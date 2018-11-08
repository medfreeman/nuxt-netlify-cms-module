import { Nuxt, Builder, Generator } from "nuxt";
import request from "request-promise-native";
import Koa from "koa";
import serveStatic from "koa-static";

import baseConfig from "./fixture/nuxt.config";

jest.setTimeout(60000);
process.env.PORT = process.env.PORT || 5060;
process.env.NODE_ENV = "production";

const url = path => `http://localhost:${process.env.PORT}${path}`;
const get = path => request(url(path));

let nuxt;
let generator;
let server;

const serve = (isStatic = false) => {
  const app = new Koa();

  app.use(
    !isStatic
      ? ctx => {
          ctx.status = 200;
          ctx.respond = false;
          ctx.req.ctx = ctx;
          nuxt.render(ctx.req, ctx.res);
        }
      : serveStatic(generator.distPath)
  );
  server = app.listen(process.env.PORT);
};

const commonBefore = async (config = {}) => {
  const mergedConfig = {
    ...baseConfig,
    ...config
  };

  // Build a fresh nuxt
  nuxt = new Nuxt(mergedConfig);
  const builder = new Builder(nuxt);
  await builder.build();
  serve();
};

const generate = async (config = {}) => {
  const mergedConfig = {
    ...baseConfig,
    ...config
  };

  // Build a fresh nuxt
  nuxt = new Nuxt(mergedConfig);
  const builder = new Builder(nuxt);
  generator = new Generator(nuxt, builder);
  await generator.generate();
  serve(true);
};

const commonAfter = async () => {
  // Close all opened resources
  server.close();
  await nuxt.close();
};

export { get, commonBefore, commonAfter, generate };
