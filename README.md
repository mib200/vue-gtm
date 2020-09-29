<h1 align="center">Vue Google Tag Manager</h1>

<h4 align="center">*** Maintainers & Contributors welcome ***</h4>

<p align="center">
  <a href="https://tagmanager.google.com/">
    <img alt="Google Tag Manager" src="https://www.gstatic.cn/analytics-suite/header/suite/v2/ic_tag_manager.svg" height="192">
  </a>
  <a href="https://vuejs.org/">
    <img alt="Vue.js" src="https://vuejs.org/images/logo.png" height="192">
  </a>
</p>

<h4 align="center">Simple implementation of Google Tag Manager in Vue.js</h4>

---

<p align="center">
  <a href="https://github.com/mib200/vue-gtm/blob/master/LICENSE">
    <img alt="license: Apache-2.0" src="https://img.shields.io/github/license/mib200/vue-gtm.svg?style=flat-square">
  </a>
  <a href="https://www.npmjs.com/package/vue-gtm">
    <img alt="NPM package" src="https://img.shields.io/npm/v/vue-gtm.svg?style=flat-square">
  </a>
  <a href="https://www.npmjs.com/package/vue-gtm">
    <img alt="downloads" src="https://img.shields.io/npm/dt/vue-gtm.svg?style=flat-square">
  </a>
  <a href="#badge">
    <img alt="code style: Prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square">
  </a>
  <a href="https://github.com/mib200/vue-gtm/actions?query=branch%3Amaster+workflow%3ACI">
    <img alt="Build Status" src="https://github.com/mib200/vue-gtm/workflows/CI/badge.svg?branch=master">
  </a>
</p>

This plugin will help you in your common GTM tasks.

**Note: If you are looking to track all Vuex mutations, you can use [Vuex GTM plugin](https://gist.github.com/matt-e-king/ebdb39088c50b96bbbbe77c5bc8abb2b)**

# Requirements

- **Vue.js.** >= 2.0.0
- **Google Tag Manager account.** To send data to

**Optional dependencies**

- **Vue Router** >= 2.x - In order to use auto-tracking of screens

# Configuration

`npm install vue-gtm` or `yarn add vue-gtm` if you use [Yarn package manager](https://yarnpkg.com)

Here is an example configuration:

```js
import { createApp } from 'vue';
import { createGtm } from 'vue-gtm';
import router from "./router";

const app = createApp(App);

app.use(router);

app.use(createGtm({
  id: 'GTM-xxxxxx' or ['GTM-xxxxxx', 'GTM-yyyyyy'], // Your GTM single container ID or array of container ids ['GTM-xxxxxx', 'GTM-yyyyyy']
  queryParams: { // Add url query string when load gtm.js with GTM ID (optional)
    gtm_auth:'AB7cDEf3GHIjkl-MnOP8qr',
    gtm_preview:'env-4',
    gtm_cookies_win:'x'
  },
  defer: false, // defaults to false. Script can be set to `defer` to increase page-load-time at the cost of less accurate results (in case visitor leaves before script is loaded, which is unlikely but possible)
  enabled: true, // defaults to true. Plugin can be disabled by setting this to false for Ex: enabled: !!GDPR_Cookie (optional)
  debug: true, // Whether or not display console logs debugs (optional)
  loadScript: true, // Whether or not to load the GTM Script (Helpful if you are including GTM manually, but need the dataLayer functionality in your components) (optional)
  vueRouter: router, // Pass the router instance to automatically sync with router (optional)
  ignoredViews: ['homepage'], // Don't trigger events for specified router names (case insensitive) (optional)
  trackOnNextTick: false, // Whether or not call trackView in Vue.nextTick
}));
```

<details>
  <summary>Vue 2 example</summary>

```js
import VueGtm from 'vue-gtm';
import VueRouter from 'vue-router';
const router = new VueRouter({ routes, mode, linkActiveClass });

Vue.use(VueGtm, {
  id: 'GTM-xxxxxx' or ['GTM-xxxxxx', 'GTM-yyyyyy'], // Your GTM single container ID or array of container ids ['GTM-xxxxxx', 'GTM-yyyyyy']
  queryParams: { // Add url query string when load gtm.js with GTM ID (optional)
    gtm_auth:'AB7cDEf3GHIjkl-MnOP8qr',
    gtm_preview:'env-4',
    gtm_cookies_win:'x'
  },
  defer: false, // defaults to false. Script can be set to `defer` to increase page-load-time at the cost of less accurate results (in case visitor leaves before script is loaded, which is unlikely but possible)
  enabled: true, // defaults to true. Plugin can be disabled by setting this to false for Ex: enabled: !!GDPR_Cookie (optional)
  debug: true, // Whether or not display console logs debugs (optional)
  loadScript: true, // Whether or not to load the GTM Script (Helpful if you are including GTM manually, but need the dataLayer functionality in your components) (optional)
  vueRouter: router, // Pass the router instance to automatically sync with router (optional)
  ignoredViews: ['homepage'], // Don't trigger events for specified router names (case insensitive) (optional)
  trackOnNextTick: false, // Whether or not call trackView in Vue.nextTick
});
```

</details>

This injects the tag manager script in the page, except when `enabled` is set to `false`.
In that case it will be injected when calling `this.$gtm.enable(true)` for the first time.

Remember to enable the History Change Trigger for router changes to be sent through GTM.

# Documentation

Once the configuration is completed, you can access vue gtm instance in your components like that:

```js
export default {
  name: "MyComponent",
  data() {
    return {
      someData: false,
    };
  },
  methods: {
    onClick() {
      this.$gtm.trackEvent({
        event: null, // Event type [default = 'interaction'] (Optional)
        category: "Calculator",
        action: "click",
        label: "Home page SIP calculator",
        value: 5000,
        noninteraction: false, // Optional
      });
    },
  },
  mounted() {
    this.$gtm.trackView("MyScreenName", "currentpath");
  },
};
```

The passed variables are mapped with GTM data layer as follows

```js
dataLayer.push({
  event: event || "interaction",
  target: category,
  action: action,
  "target-properties": label,
  value: value,
  "interaction-type": noninteraction,
  ...rest,
});
```

You can also access the instance anywhere whenever you imported `Vue` by using `Vue.gtm`. It is especially useful when you are in a store module or somewhere else than a component's scope.

## Sync gtm with your router

Thanks to vue-router guards, you can automatically dispatch new screen views on router change!
To use this feature, you just need to inject the router instance on plugin initialization.

This feature will generate the view name according to a priority rule:

- If you defined a meta field for you route named `gtm` this will take the value of this field for the view name.
- Otherwise, if the plugin don't have a value for the `meta.gtm` it will fallback to the internal route name.

Most of time the second case is enough, but sometimes you want to have more control on what is sent, this is where the first rule shine.

Example:

```js
const myRoute = {
  path: "myRoute",
  name: "MyRouteName",
  component: SomeComponent,
  meta: { gtm: "MyCustomValue" },
};
```

> This will use `MyCustomValue` as the view name.

## Methods

### Enable plugin

Check if plugin is enabled

```js
this.$gtm.enabled();
```

Enable plugin

```js
this.$gtm.enable(true);
```

Disable plugin

```js
this.$gtm.enable(false);
```

### Debug plugin

Check if plugin is in debug mode

```js
this.$gtm.debugEnabled();
```

Enable debug mode

```js
this.$gtm.debug(true);
```

Disable plugin

```js
this.$gtm.debug(false);
```

## Credits

[ScreamZ vue-analytics](https://github.com/ScreamZ/vue-analytics)
