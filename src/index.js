import { loadScript } from './utils'
import pluginConfig from './config'
import GtmPlugin from './GtmPlugin'

/**
 * Installation procedure
 *
 * @param Vue
 * @param initConf
 */
const install = function (Vue, initConf = {}) {
  // Apply default configuration
  initConf = { ...pluginConfig, ...initConf }

  pluginConfig.id = initConf.id
  pluginConfig.debug = initConf.debug
  pluginConfig.enabled = initConf.enabled
  pluginConfig.loadScript = initConf.loadScript
  pluginConfig.defer = initConf.defer

  // Handle vue-router if defined
  if (initConf.vueRouter) {
    initVueRouterGuard(Vue, initConf)
  }

  // Add to vue prototype and also from globals
  Vue.prototype.$gtm = Vue.gtm = new GtmPlugin(pluginConfig.id)

  // Load GTM script when enabled
  if (pluginConfig.enabled && pluginConfig.loadScript) {
    if (Array.isArray(initConf.id)) {
      initConf.id.forEach((id) => {
        loadScript(id, initConf);
      });
    } else {
      loadScript(initConf.id, initConf);
    }
  }
}

/**
 * Init the router guard.
 *
 * @param Vue - The Vue instance
 * @param vueRouter - The Vue router instance to attach guard
 * @param {string[]} ignoredViews - An array of route name to ignore
 * @param trackOnNextTick - Whether or not call trackView in Vue.nextTick
 *
 * @returns {string[]} The ignored routes names formalized.
 */
const initVueRouterGuard = function (Vue, { vueRouter, ignoredViews, trackOnNextTick }) {
  // Flatten routes name
  if (ignoredViews) {
    ignoredViews = ignoredViews.map(view => view.toLowerCase())
  }

  vueRouter.afterEach(to => {
    // Ignore some routes
    if (!to.name || (ignoredViews && ignoredViews.indexOf(to.name.toLowerCase()) !== -1)) {
      return
    }

    // Dispatch vue event using meta gtm value if defined otherwise fallback to route name
    const name = to.meta.gtm || to.name
    const baseUrl = vueRouter.options.base || '';
    let fullUrl = baseUrl
    if (!fullUrl.endsWith('/')) {
      fullUrl += '/'
    }
    fullUrl += (to.fullPath.startsWith('/') ? to.fullPath.substr(1) : to.fullPath)

    if (trackOnNextTick) {
      Vue.nextTick(() => {
        Vue.gtm.trackView(name, fullUrl)
      })
    } else {
      Vue.gtm.trackView(name, fullUrl)
    }
  })

  return ignoredViews
}

// Export module
export default { install }
