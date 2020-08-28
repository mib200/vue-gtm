<h1 align="center">
  Vue Google Tag Manager
  <h4 align="center">*** Maintainers & Contributors welcome ***</h4>
  <br>
  <br>
</h1>

<h4 align="center">Simple implementation of Google Tag Manager in Vue.js</h4>

<p align="center">
  <a href="https://github.com/feross/standard"><img src="https://cdn.rawgit.com/feross/standard/master/badge.svg" alt="Standard - JavaScript Style Guide"></a>
</p>
<br>

This plugin will helps you in your common GTM tasks.

**Note: If you are looking to track all Vuex mutations, you can use [Vuex GTM plugin](https://gist.github.com/matt-e-king/ebdb39088c50b96bbbbe77c5bc8abb2b)**

# Requirements

* **Vue.js.** >= 2.0.0
* **Google Tag Manager account.** To send data to

**Optionnals dependencies**

* **Vue Router** >= 2.x - In order to use auto-tracking of screens

# Configuration

`npm install vue-gtm -S` or `yarn add vue-gtm` if you use [Yarn package manager](https://yarnpkg.com/)

Here is an example of configuration, compose with it on your own :

```javascript
import VueGtm from 'vue-gtm';
import VueRouter from 'vue-router';
const router = new VueRouter({ routes, mode, linkActiveClass });

Vue.use(VueGtm, {
  id: 'GTM-xxxxxxx' or ['GTM-xxxxxxx', 'GTM-xxxxxxx'], // Your GTM single container ID or array of container ids ['GTM-xxxxxxx', 'GTM-yyyyyyy']
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
  ignoredViews: ['homepage'], // If router, you can exclude some routes name (case insensitive) (optional)
  trackOnNextTick: false, // Whether or not call trackView in Vue.nextTick
});
```

This injects the tag manager script in the page, except when `enabled` is set to `false`.
In that case it will be injected when calling `this.$gtm.enable(true)` for the first time.

Remember to enable the History Change Trigger for router changes to be sent through GTM.

# Documentation

Once the configuration is completed, you can access vue gtm instance in your components like that :

```javascript
export default {
  name: 'MyComponent',
  data() {
    return {
      someData: false
    };
  },
  methods: {
    onClick: function() {
      this.$gtm.trackEvent({
        event: null, // Event type [default = 'interaction'] (Optional)
        category: 'Calculator',
        action: 'click',
        label: 'Home page SIP calculator',
        value: 5000,
        noninteraction: false // Optional
      });
    }
  },
  mounted() {
    this.$gtm.trackView('MyScreenName', 'currentpath');
  }
};
```

The passed variables are mapped with GTM data layer as follows

```
dataLayer.push({
	'event': event || 'interaction',
	'target': category,
	'action': action,
	'target-properties': label,
	'value': value,
	'interaction-type': noninteraction,
	...rest
});
```

You can also access the instance anywhere whenever you imported `Vue` by using `Vue.gtm`. It is especially useful when you are in a store module or
somewhere else than a component's scope.

## Sync gtm with your router

Thanks to vue-router guards, you can automatically dispatch new screen views on router change !
To use this feature, you just need to inject the router instance on plugin initialization.

This feature will generate the view name according to a priority rule :

* If you defined a meta field for you route named `gtm` this will take the value of this field for the view name.
* Otherwise, if the plugin don't have a value for the `meta.gtm` it will fallback to the internal route name.

Most of time the second case is enough, but sometimes you want to have more control on what is sent, this is where the first rule shine.

Example :

```javascript
const myRoute = {
  path: 'myRoute',
  name: 'MyRouteName',
  component: SomeComponent,
  meta: { gtm: 'MyCustomValue' }
};
```

> This will use `MyCustomValue` as the view name.

## Methods

### Enable plugin

Check if plugin is enabled

```
this.$gtm.enabled()
```

Enable plugin

```
this.$gtm.enable(true)
```

Disable plugin

```
this.$gtm.enable(false)
```

### Debug plugin

Check if plugin is in debug mode

```
this.$gtm.debugEnabled()
```

Enable debug mode

```
this.$gtm.debug(true)
```

Disable plugin

```
this.$gtm.debug(false)
```

## Credits

[ScreamZ vue-analytics](https://github.com/ScreamZ/vue-analytics)
