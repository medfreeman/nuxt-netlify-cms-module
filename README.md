# nuxt-netlify-cms-module

[![Greenkeeper badge](https://badges.greenkeeper.io/medfreeman/nuxt-netlify-cms-module.svg)](https://greenkeeper.io/)

[![npm version](https://img.shields.io/npm/v/nuxt-netlify-cms.svg)](https://www.npmjs.com/package/nuxt-netlify-cms)
[![npm](https://img.shields.io/npm/dt/nuxt-netlify-cms.svg?style=flat-square)](https://npmjs.com/package/nuxt-netlify-cms)
[![Build Status](https://img.shields.io/travis/medfreeman/nuxt-netlify-cms-module.svg?label=build)](https://travis-ci.org/medfreeman/nuxt-netlify-cms-module)
[![Codecov](https://img.shields.io/codecov/c/github/medfreeman/nuxt-netlify-cms-module.svg?style=flat-square)](https://codecov.io/gh/medfreeman/nuxt-netlify-cms-module)
[![Dependencies](https://img.shields.io/david/medfreeman/nuxt-netlify-cms-module.svg)](https://david-dm.org/medfreeman/nuxt-netlify-cms-module)
[![devDependencies](https://img.shields.io/david/dev/medfreeman/nuxt-netlify-cms-module.svg)](https://david-dm.org/medfreeman/nuxt-netlify-cms-module?type=dev)

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

> Easy Netlify CMS integration with nuxt.js

[📖 **Release Notes**](./CHANGELOG.md)

## Features

- Automatically build Netlify CMS through a seamless integration with nuxt.js webpack instance
- [Automatically serve Netlify CMS to a chosen path](#adminpath), in development and production builds
- [Support Netlify CMS config.yml](#netlify-cms-configyml), with automatic rebuild on change

## Setup
- Add `nuxt-netlify-cms` devDependency using yarn or npm to your project

  `npm i -D nuxt-netlify-cms` OR `yarn add -D nuxt-netlify-cms`

- Add `nuxt-netlify-cms` to `modules` section of `nuxt.config.js`

```js
{
  modules: [
    // Simple usage
    "nuxt-netlify-cms",

    // With options
    ["nuxt-netlify-cms", { adminPath: "secure" }],
  ],

  // You can optionally use global options instead of inline form
  netlifyCms: {
    adminPath: "secure"
  }
}
```

## Usage

### Netlify CMS `config.yml`

You can specify a [custom configuration](https://www.netlifycms.org/docs/#configuration), that will be parsed and merged with the module's [netlify CMS options](#cmsconfig).

You have to place the file in your [project root](https://nuxtjs.org/api/configuration-rootdir/) and name it `netlify-cms.yml` instead of `config.yml`, for clarity.

:information_source: Note that each path in the file (`media_folder` and collections `folder` fields) will be rewritten to prepend nuxt.js [srcDir](https://nuxtjs.org/api/configuration-srcdir/), so please specify each path relative to this folder.

This file can be changed while `nuxt dev` is running, and Netlify CMS will be updated automatically. At the moment, you'll have to refresh your browser window manually after the build is complete.

## Options
You can pass options using module options or `netlifyCms` section in `nuxt.config.js`.

### `adminPath`
- Default: `"admin"`

adminPath defines the path where Netlify CMS will be served.

With nuxt default configuration, it will be served to `http://localhost:3000/admin/` in development.

### `cmsConfig`
- Default: `{
    media_folder: "static/uploads"
  }`

cmsConfig wholly reflects [Netlify CMS config.yml](#netlify-cms-configyml), in js object format.

:information_source: The order of precedence for the cms configuration is defaults < `netlify-cms.yml` < module options

:information_source: The paths are also rewritten according to nuxt.js [srcDir](https://nuxtjs.org/api/configuration-srcdir/)

## CONTRIBUTING

* ⇄ Pull requests and ★ Stars are always welcome.
* For bugs and feature requests, please create an issue.
* Pull requests must be accompanied by passing automated tests (`$ yarn test`).

## License

[MIT License](./LICENSE)

Copyright (c) Mehdi Lahlou <mlahlou@protonmail.ch>
