# nuxt-netlify-cms-module

[![npm version](https://img.shields.io/npm/v/nuxt-netlify-cms.svg)](https://www.npmjs.com/package/nuxt-netlify-cms)
[![npm](https://img.shields.io/npm/dt/nuxt-netlify-cms.svg?style=flat-square)](https://npmjs.com/package/nuxt-netlify-cms)
[![circleci](https://badgen.net/circleci/github/medfreeman/nuxt-netlify-cms-module/master)](https://circleci.com/gh/medfreeman/nuxt-netlify-cms-module)
[![Codecov](https://img.shields.io/codecov/c/github/medfreeman/nuxt-netlify-cms-module.svg?style=flat-square)](https://codecov.io/gh/medfreeman/nuxt-netlify-cms-module)
[![Greenkeeper badge](https://badges.greenkeeper.io/medfreeman/nuxt-netlify-cms-module.svg)](https://greenkeeper.io/)
[![Dependencies](https://img.shields.io/david/medfreeman/nuxt-netlify-cms-module.svg)](https://david-dm.org/medfreeman/nuxt-netlify-cms-module)
[![devDependencies](https://img.shields.io/david/dev/medfreeman/nuxt-netlify-cms-module.svg)](https://david-dm.org/medfreeman/nuxt-netlify-cms-module?type=dev)

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

> Easy [Netlify CMS](https://www.netlifycms.org/) integration with nuxt.js

[📖 **Release Notes**](./CHANGELOG.md)

## Features

- Automatically build Netlify CMS through a seamless integration with nuxt.js webpack instance
- [Automatically serve Netlify CMS to a chosen path](#adminpath), in development and production builds
- [Support Netlify CMS config.yml](#netlify-cms-configyml), with automatic rebuild on change
- [Meant to be used with nuxtent-module](https://github.com/nuxt-community/nuxtent-module), that allows nuxt to work with static content files

## Setup
- Add `nuxt-netlify-cms` and `netlify-cms` devDependencies using yarn or npm to your project

  `npm i -D nuxt-netlify-cms netlify-cms` OR `yarn add -D nuxt-netlify-cms netlify-cms`

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

### Netlify CMS module config folder

This module will look for the Netlify CMS config file and extensions in the following folder: `[nuxt.js srcDir]/netlify-cms`.

:information_source: The nuxt.js [srcDir](https://nuxtjs.org/api/configuration-srcdir/) is set to the project root folder by default. If you don't change this value in nuxt config, you'll just have to create the "netlify-cms" directory at your project root folder.

:information_source: If you don't use any of the following two features, there's no need to create this folder. But since `netlify-cms` needs a configuration specific to your repository, you'll have to specify it through [options](#cmsconfig).

#### Netlify CMS `config.yml`

You can specify a [custom configuration](https://www.netlifycms.org/docs/add-to-your-site/#configuration), that will be parsed and merged with the module's [netlify CMS options](#cmsconfig).

You have to place the file in your Netlify CMS module config folder and name it `config.yml`.

:information_source: Note that each path in the file (`media_folder`, collections `folder` fields and collections `file` fields) will be rewritten to prepend nuxt.js [srcDir](https://nuxtjs.org/api/configuration-srcdir/), so please specify each path relative to this folder.

This file can be changed while `nuxt dev` is running, and Netlify CMS will be updated automatically.

#### Netlify CMS customizations

This module will look for Netlify CMS customizations in \*.js files contained in Netlify CMS module config folder and subfolders, and include them in the CMS build.

These are of two kinds, [Custom Previews](https://www.netlifycms.org/docs/customization/) and [Custom Widgets](https://www.netlifycms.org/docs/custom-widgets/).

:information_source: The global variable `CMS` is available to these javascript files to reference the CMS object.

:information_source: The contents of this directory and subdirectories can be changed while `nuxt dev` is running, and Netlify CMS will be updated automatically.

## Options
You can pass options using module options or `netlifyCms` section in `nuxt.config.js`.

### `adminPath`
- Default: `"admin"`

adminPath defines the path where Netlify CMS will be served.

With nuxt default configuration, it will be served to `http://localhost:3000/admin/` in development.

### `adminTitle`
- Default: `"Content Manager"`

adminTitle defines the html title of the page where Netlify CMS will be served.

### `cmsConfig`
- Default: `{
    media_folder: "static/uploads"
  }`

cmsConfig wholly reflects [Netlify CMS config.yml](#netlify-cms-configyml), in js object format.

:information_source: The order of precedence for the cms configuration is `defaults` < `netlify-cms.yml` < `module options`

:information_source: The paths are also rewritten according to nuxt.js [srcDir](https://nuxtjs.org/api/configuration-srcdir/)

## CONTRIBUTING

* ⇄ Pull requests and ★ Stars are always welcome.
* For bugs and feature requests, please create an issue.
* Pull requests must be accompanied by passing automated tests (`$ yarn test`).

## License

[MIT License](./LICENSE)

Copyright (c) Mehdi Lahlou <mlahlou@protonmail.ch>
