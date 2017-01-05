import pluginConfig from './config';
import GtmPlugin from './GtmPlugin';

/**
 * Installation procedure
 *
 * @param Vue
 * @param initConf
 */
const install = function (Vue, initConf = {}) {
  // Apply default configuration
  initConf = { ...pluginConfig, ...initConf }

	pluginConfig.debug = initConf.debug;

  // Handle vue-router if defined
  if (initConf.vueRouter) {
		initVueRouterGuard(Vue, initConf.vueRouter, initConf.ignoredViews);
  }

  // Add to vue prototype and also from globals
	Vue.prototype.$gtm = Vue.gtm = new GtmPlugin();
}

/**
 * Init the router guard.
 *
 * @param Vue - The Vue instance
 * @param vueRouter - The Vue router instance to attach guard
 * @param {string[]} ignoredViews - An array of route name to ignore
 *
 * @returns {string[]} The ignored routes names formalized.
 */
const initVueRouterGuard = function (Vue, vueRouter, ignoredViews) {
  // Flatten routes name
  if (ignoredViews) {
    ignoredViews = ignoredViews.map(view => view.toLowerCase())
  }

  vueRouter.afterEach(to => {
    // Ignore some routes
    if (ignoredViews && ignoredViews.indexOf(to.name.toLowerCase()) !== -1) {
      return
    }

    // Dispatch vue event using meta gtm value if defined otherwise fallback to route name
		Vue.gtm.trackView(to.meta.gtm || to.name, to.path);
  })

  return ignoredViews;
}

// Export module
export default { install }