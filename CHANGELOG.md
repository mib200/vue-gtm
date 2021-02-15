# Next

[diff](https://github.com/mib200/vue-gtm/compare/3.3.2...master)

- Provide possibility to override `isInBrowserContext` check ([01f3651])
- Significantly improve JSDoc ([9edc30d])
- Add `vue-router` as `devDependency` for type definition ([593af25])
- Fix `vue-router` access `base` from history options  
  _This only affects Vue 3_

[01f3651]: https://github.com/mib200/vue-gtm/commit/01f3651de1df4f679c60af05697af41b1a38d39b
[9edc30d]: https://github.com/mib200/vue-gtm/commit/9edc30daf0c2bdf542c82d07c2f413421f44de3d
[593af25]: https://github.com/mib200/vue-gtm/commit/593af254f51a122f868c3687f42abdcb3549b07e

# 3.3.2

[diff](https://github.com/mib200/vue-gtm/compare/3.3.1...3.3.2)

- Pass queryParams correctly to script ([#117])

[#117]: https://github.com/mib200/vue-gtm/pull/117

# 3.3.1

[diff](https://github.com/mib200/vue-gtm/compare/3.3.0...3.3.1)

- Hotfix for `dataLayer`

# 3.3.0

[diff](https://github.com/mib200/vue-gtm/compare/3.2.1...3.3.0)

- Multiple GTM-container support ([#114])

[#114]: https://github.com/mib200/vue-gtm/pull/114

# 3.2.1

[diff](https://github.com/mib200/vue-gtm/compare/3.2.0...3.2.1)

- Fix $gtm typing ([#111])

[#111]: https://github.com/mib200/vue-gtm/issues/111

# 3.2.0

[diff](https://github.com/mib200/vue-gtm/compare/3.1.1...3.2.0)

- Usable gtm instance in composition API ([#107])

[#107]: https://github.com/mib200/vue-gtm/pull/107

# 3.1.1

[diff](https://github.com/mib200/vue-gtm/compare/3.1.0...3.1.1)

- Load `queryParams` also when using the `enable` function ([#102])

[#102]: https://github.com/mib200/vue-gtm/issues/102

# 3.1.0

[diff](https://github.com/mib200/vue-gtm/compare/3.0.0...3.1.0)

- Add `compatibility` for `defer` option for old browsers ([#101])

[#101]: https://github.com/mib200/vue-gtm/pull/101

# 3.0.0

[diff](https://github.com/mib200/vue-gtm/compare/2.3.4...3.0.0)

## BREAKING CHANGE

- There are incompatibilities in the TypeScript definitions of Vue 2.x and 3.x.  
  That's why we're going to offer **two** releases for an indefinite period of time
  - `3.0.0` with a npm tag `latest`: Vue 3.x
  - `3.0.0-vue2` with a npm tag `vue2`: Vue 2.x
- The class name of the `$gtm` instance changed from `AnalyticsPlugin` to `VueGtmPlugin`

## Other Changes

- Possibility to track additional event data
- Throw error on invalid `GTM-ID`
- Fix handling of multiple `GTM-ID`s
- Project rewritten to TypeScript

# 2.3.4

[diff](https://github.com/mib200/vue-gtm/compare/2.3.3...2.3.4)

- Add a more restrictive condition on `hasScript` function

# 2.3.3

[diff](https://github.com/mib200/vue-gtm/compare/2.3.2...2.3.3)

- Fix `enable` method, after added `defer` feature
- Update TypeScript declarations

# 2.3.2

[diff](https://github.com/mib200/vue-gtm/compare/2.3.1...2.3.2)

- Fix: Cannot read property 'defer' of undefined" after enabling the plugin with a user interaction

# 2.3.1

[diff](https://github.com/mib200/vue-gtm/compare/2.3.0...2.3.1)

- Add possibility to `defer` script
- Add rest param to `trackEvent` typing
- Multiple bug fixes

# 2.3.0

[diff](https://github.com/mib200/vue-gtm/compare/2.2.0...2.3.0)

- Improve debugging
- Add TypeScript declarations
- Bugfix: Only load GTM Script if `loadScript` is set to `true`
- Add query params to GTM script url

# 2.2.0

[diff](https://github.com/mib200/vue-gtm/compare/2.1.0...2.2.0)

- Exposing data layer
- Add config param for url of loading gtm.js

# 2.1.0

[diff](https://github.com/mib200/vue-gtm/compare/2.0.1...2.1.0)

- Add config value for loading the script
- Add the base path to the URL
- Load script config option
- Accepting ID as an array

# 2.0.1

[diff](https://github.com/mib200/vue-gtm/compare/2.0.0...2.0.1)

- Add view name to event property
- If no id provided do not insert tag manager script tag (dev environment)
- Ignored views when load from `ignoredViews`

# 2.0.0

[diff](https://github.com/mib200/vue-gtm/compare/1.0.3...2.0.0)

- Make GTM ID a config option
- Changed handling of GTM ID

# 1.0.3

[diff](https://github.com/mib200/vue-gtm/compare/1.0.2...1.0.3)

- Ability to `enable`/`disable` plugin
- Call `trackView` on next tick

# 1.0.2

[diff](https://github.com/mib200/vue-gtm/compare/1.0.1...1.0.2)

- Possibility to add additional `dataLayer` variables
- Track `fullPath`

# 1.0.1

[diff](https://github.com/mib200/vue-gtm/compare/1.0.0...1.0.1)

- Updated Google GTM inclusion method
- Only run in browser. SSR compatibility

# 1.0.0

[diff](https://github.com/mib200/vue-gtm/compare/47e53145f6b8e8b7236beb59078d7e7b0fb3b6ff...1.0.0)

- Initial release
