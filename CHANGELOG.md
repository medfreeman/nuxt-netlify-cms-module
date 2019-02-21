# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

# [4.0.0](https://github.com/medfreeman/nuxt-netlify-cms-module/compare/v3.1.0...v4.0.0) (2019-02-21)


### Bug Fixes

* **package:** update style-loader to version 0.23.0 ([#75](https://github.com/medfreeman/nuxt-netlify-cms-module/issues/75)) ([004f9eb](https://github.com/medfreeman/nuxt-netlify-cms-module/commit/004f9eb))


### Features

* **module:** compatibility with `nuxt` v2 ([#111](https://github.com/medfreeman/nuxt-netlify-cms-module/issues/111)) ([41c450e](https://github.com/medfreeman/nuxt-netlify-cms-module/commit/41c450e)), closes [nuxt-community/nuxtent-module#190](https://github.com/nuxt-community/nuxtent-module/issues/190)


### BREAKING CHANGES

* **module:** This module is no more compatible with nuxt versions older than v2.0.0
Update `nuxt` devDependency to v.2.0.0

Compatibility with webpack v4
Add `FriendlyErrorsWebpackPlugin`
Add `@nuxt/friendly-errors-webpack-plugin`, `extract-css-chunks-webpack-plugin`
Use `consola` instead of debug for logging, improve messages
Add `webpackbar` in production, improve logging
Upgrade husky, move config to its own key
Remove `.yarnrc` engine compatibility fix



<a name="3.1.0"></a>
# [3.1.0](https://github.com/medfreeman/nuxt-netlify-cms-module/compare/v3.0.2...v3.1.0) (2018-08-07)


### Bug Fixes

* **module:** fix compatibility with `nuxt generate` ([c518a10](https://github.com/medfreeman/nuxt-netlify-cms-module/commit/c518a10)), closes [#59](https://github.com/medfreeman/nuxt-netlify-cms-module/issues/59)

Thanks @jmcmullen & @easherma!

### Features

* **module:** compatibility with `netlify-cms` v2 ([6800ea4](https://github.com/medfreeman/nuxt-netlify-cms-module/commit/6800ea4)), closes [#64](https://github.com/medfreeman/nuxt-netlify-cms-module/issues/64)



<a name="3.0.2"></a>
## [3.0.2](https://github.com/medfreeman/nuxt-netlify-cms-module/compare/v3.0.1...v3.0.2) (2018-08-04)


### Bug Fixes

* use `cms-config-url` html link to determine proper netlify cms `config.yml` path ([1b07d51](https://github.com/medfreeman/nuxt-netlify-cms-module/commit/1b07d51))



<a name="3.0.1"></a>
## [3.0.1](https://github.com/medfreeman/nuxt-netlify-cms-module/compare/v3.0.0...v3.0.1) (2018-04-29)


### Bug Fixes

* **package:** fix `regeneratorRuntime` error ([f96d5fe](https://github.com/medfreeman/nuxt-netlify-cms-module/commit/f96d5fe)), closes [#51](https://github.com/medfreeman/nuxt-netlify-cms-module/issues/51)

* **docs:** fix update readme.md links to match Netlify's docs

Thanks gangsthub !



<a name="3.0.0"></a>
# [3.0.0](https://github.com/medfreeman/nuxt-netlify-cms-module/compare/v2.0.1...v3.0.0) (2018-04-22)


### Features

* **module:** compatibility with `nuxt` v1 ([416737e](https://github.com/medfreeman/nuxt-netlify-cms-module/commit/416737e))


### BREAKING CHANGES

* **module:** This module is no more compatible with nuxt versions older than v1.0.0
Update `nuxt` devDependency to v.1.4.0



<a name="2.0.1"></a>
## [2.0.1](https://github.com/medfreeman/nuxt-netlify-cms-module/compare/v2.0.0...v2.0.1) (2017-09-22)


### Bug Fixes

* **module:** properly move the CMS build to the `dist` folder on `nuxt generate` ([dd4b970](https://github.com/medfreeman/nuxt-netlify-cms-module/commit/dd4b970)), closes [#23](https://github.com/medfreeman/nuxt-netlify-cms-module/issues/23)



<a name="2.0.0"></a>
# [2.0.0](https://github.com/medfreeman/nuxt-netlify-cms-module/compare/v1.2.1...v2.0.0) (2017-09-21)


### Bug Fixes

* **package:** eslint compliance on commonjs index ([55a8f07](https://github.com/medfreeman/nuxt-netlify-cms-module/commit/55a8f07))


### Chores

* **package:** re-export module in commonjs format ([1bba36c](https://github.com/medfreeman/nuxt-netlify-cms-module/commit/1bba36c)), closes [#19](https://github.com/medfreeman/nuxt-netlify-cms-module/issues/19)


### Features

* **config:** enforce a single `netlify-cms` folder ([3fcbc2c](https://github.com/medfreeman/nuxt-netlify-cms-module/commit/3fcbc2c)), closes [#21](https://github.com/medfreeman/nuxt-netlify-cms-module/issues/21)


### BREAKING CHANGES

* **config:** the cms config file should be placed in the "netlify-cms" folder and named "config.yml" along with the extensions js files
* **config:** remove `extensionsDir` option
* **package:** remove having to use `.default` while requiring this module



<a name="1.2.1"></a>
## [1.2.1](https://github.com/medfreeman/nuxt-netlify-cms-module/compare/v1.2.0...v1.2.1) (2017-09-18)


### Bug Fixes

* **cms-config:** properly prepend `file` paths with nuxt `srcDir` ([c189b0f](https://github.com/medfreeman/nuxt-netlify-cms-module/commit/c189b0f)), closes [#18](https://github.com/medfreeman/nuxt-netlify-cms-module/issues/18)



<a name="1.2.0"></a>
# [1.2.0](https://github.com/medfreeman/nuxt-netlify-cms-module/compare/v1.1.0...v1.2.0) (2017-09-09)


### Bug Fixes

* **build:** fix various rebuild errors ([229a257](https://github.com/medfreeman/nuxt-netlify-cms-module/commit/229a257)), closes [#7](https://github.com/medfreeman/nuxt-netlify-cms-module/issues/7) [#9](https://github.com/medfreeman/nuxt-netlify-cms-module/issues/9) [#10](https://github.com/medfreeman/nuxt-netlify-cms-module/issues/10)
* **package:** remove duplicate `lodash.omit` dependency ([d5e1017](https://github.com/medfreeman/nuxt-netlify-cms-module/commit/d5e1017))


### Features

* **build:** add a notification of bundle rebuilding and completion ([6c51d10](https://github.com/medfreeman/nuxt-netlify-cms-module/commit/6c51d10)), closes [#11](https://github.com/medfreeman/nuxt-netlify-cms-module/issues/11)
* **build:** add webpack hot reloading ([05748d7](https://github.com/medfreeman/nuxt-netlify-cms-module/commit/05748d7)), closes [#15](https://github.com/medfreeman/nuxt-netlify-cms-module/issues/15)
* **build:** show pretty build status ([c4107f2](https://github.com/medfreeman/nuxt-netlify-cms-module/commit/c4107f2))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/medfreeman/nuxt-netlify-cms-module/compare/v1.0.0...v1.1.0) (2017-09-08)


### Bug Fixes

* **core:** avoid calling file existsSync before reading ([312c14b](https://github.com/medfreeman/nuxt-netlify-cms-module/commit/312c14b))


### Features

* **core:** add support for netlify-cms extensions ([f670cf3](https://github.com/medfreeman/nuxt-netlify-cms-module/commit/f670cf3))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/medfreeman/nuxt-netlify-cms-module/compare/v0.1.4...v1.0.0) (2017-09-04)


### Features

* **package:** allow end-user to specify `netlify-cms` version ([78bda84](https://github.com/medfreeman/nuxt-netlify-cms-module/commit/78bda84))


### BREAKING CHANGES

* **package:** Move `netlify-cms` from dependencies to devDependencies and peerDependencies
Update readme



<a name="0.1.4"></a>
## [0.1.4](https://github.com/medfreeman/nuxt-netlify-cms-module/compare/v0.1.3...v0.1.4) (2017-09-04)


### Bug Fixes

* **README:** add missing module require instructions ([3192aae](https://github.com/medfreeman/nuxt-netlify-cms-module/commit/3192aae))



<a name="0.1.3"></a>
## [0.1.3](https://github.com/medfreeman/nuxt-netlify-cms-module/compare/v0.1.2...v0.1.3) (2017-09-04)


### Bug Fixes

* **core:** transpile utils to allow module to work ([141c677](https://github.com/medfreeman/nuxt-netlify-cms-module/commit/141c677))



<a name="0.1.2"></a>
## [0.1.2](https://github.com/medfreeman/nuxt-netlify-cms-module/compare/v0.1.1...v0.1.2) (2017-09-04)



<a name="0.1.1"></a>
## [0.1.1](https://github.com/medfreeman/nuxt-netlify-cms-module/compare/0.1.0...0.1.1) (2017-09-04)


### Bug Fixes

* **core:** transpile webpack config to allow module to work ([afdd102](https://github.com/medfreeman/nuxt-netlify-cms-module/commit/afdd102))



# 0.1.0 - 2017-08-02

- Initial release
