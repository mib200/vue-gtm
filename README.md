<h1 align="center">
  Vue Google Tag Manager
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

- **Vue.js.** >= 2.0.0
- **Google Tag Manager account.** To send data to

**Optionnals dependencies**

- **Vue Router** >= 2.x - In order to use auto-tracking of screens


# Configuration

`npm install vue-gtm -S` or `yarn add vue-gtm` if you use [Yarn package manager](https://yarnpkg.com/)

Here is an example of configuration, compose with it on your own :

You have to include Google GTM normally as you would in any other application. Directly inside index.html (root page) of your app.

For ex: 

`<noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-XXXXXX"
	height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
	<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
	new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
	j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
	'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
	})(window,document,'script','dataLayer','GTM-XXXXXX');</script>`

Then in your app.js of Vue project,

```javascript
import VueGtm from 'vue-gtm'
import VueRouter from 'vue-router'
const router = new VueRouter({routes, mode, linkActiveClass})

Vue.use(VueGtm, {
  debug: true, // Whether or not display console logs debugs (optional)
  vueRouter: router, // Pass the router instance to automatically sync with router (optional)
  ignoredViews: ['homepage'], // If router, you can exclude some routes name (case insensitive) (optional)
})
```

# Documentation

Once the configuration is completed, you can access vue gtm instance in your components like that :

```javascript
export default {
    name: 'MyComponent',
    data () {
      return {
        someData: false
      }
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
    mounted () {
      this.$gtm.trackView('MyScreenName', 'currentpath');
    }
}
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
- If you defined a meta field for you route named `gtm` this will take the value of this field for the view name.
- Otherwise, if the plugin don't have a value for the `meta.gtm` it will fallback to the internal route name.

Most of time the second case is enough, but sometimes you want to have more control on what is sent, this is where the first rule shine.

Example : 
```javascript
const myRoute = {
  path: 'myRoute',
  name: 'MyRouteName',
  component: SomeComponent,
  meta: {gtm: 'MyCustomValue'}
}
```

> This will use `MyCustomValue` as the view name.

## Credits
[ScreamZ vue-analytics](https://github.com/ScreamZ/vue-analytics)
