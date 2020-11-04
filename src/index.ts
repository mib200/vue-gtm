import { App, nextTick, Plugin } from "vue";
import pluginConfig, { VueGtmUseOptions } from "./config";
import GtmPlugin from "./plugin";
import { loadScript } from "./utils";

const GTM_ID_PATTERN: RegExp = /^GTM\-[0-9A-Z]+$/;

/**
 * Installation procedure
 *
 * @param Vue
 * @param initConf
 */
function install(Vue: App, initConf: VueGtmUseOptions = { id: "" }): void {
  if (Array.isArray(initConf.id)) {
    for (const id of initConf.id) {
      if (!GTM_ID_PATTERN.test(id)) {
        throw new Error(`GTM-ID '${id}' is not valid`);
      }
    }
  } else if (!GTM_ID_PATTERN.test(initConf.id)) {
    throw new Error(`GTM-ID '${initConf.id}' is not valid`);
  }

  // Apply default configuration
  initConf = { ...pluginConfig, ...initConf };

  pluginConfig.id = initConf.id;
  pluginConfig.debug = initConf.debug;
  pluginConfig.enabled = initConf.enabled;
  pluginConfig.loadScript = initConf.loadScript;
  pluginConfig.defer = initConf.defer;
  pluginConfig.compability = initConf.compability;

  // Handle vue-router if defined
  if (initConf.vueRouter) {
    initVueRouterGuard(Vue, initConf);
  }

  // Add to vue prototype and also from globals
  Vue.config.globalProperties.$gtm = new GtmPlugin(pluginConfig.id);

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

  Vue.provide("gtm", initConf);
}

/**
 * Init the router guard.
 *
 * @param Vue - The Vue instance
 * @param vueRouter - The Vue router instance to attach guard
 * @param ignoredViews - An array of route name to ignore
 * @param trackOnNextTick - Whether or not call trackView in Vue.nextTick
 *
 * @returns The ignored routes names formalized.
 */
function initVueRouterGuard(
  Vue: App,
  { vueRouter, ignoredViews, trackOnNextTick }: VueGtmUseOptions
): string[] | undefined {
  // Flatten routes name
  if (ignoredViews) {
    ignoredViews = ignoredViews.map((view) => view.toLowerCase());
  }

  vueRouter.afterEach(
    (to: {
      name?: string;
      meta: Partial<{
        gtm: string;
        gtmAdditionalEventData: Record<string, any>;
      }>;
      fullPath: string;
    }) => {
      // Ignore some routes
      if (!to.name || (ignoredViews && ignoredViews.indexOf(to.name.toLowerCase()) !== -1)) {
        return;
      }

      // Dispatch vue event using meta gtm value if defined otherwise fallback to route name
      const name: string = to.meta.gtm || to.name;
      const additionalEventData: Record<string, any> = to.meta.gtmAdditionalEventData ?? {};
      const baseUrl: string = vueRouter.options.base || "";
      let fullUrl: string = baseUrl;
      if (!fullUrl.endsWith("/")) {
        fullUrl += "/";
      }
      fullUrl += to.fullPath.startsWith("/") ? to.fullPath.substr(1) : to.fullPath;

      if (trackOnNextTick) {
        nextTick(() => {
          Vue.config.globalProperties.$gtm.trackView(name, fullUrl, additionalEventData);
        });
      } else {
        Vue.config.globalProperties.$gtm.trackView(name, fullUrl, additionalEventData);
      }
    }
  );

  return ignoredViews;
}

export function createGtm(options: VueGtmUseOptions) {
  return { install: (app: App) => install(app, options) };
}

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    $gtm: VueGtmPlugin;
  }
}

export type VueGtmPlugin = Plugin;
export { VueGtmUseOptions } from "./config";

const _default: VueGtmPlugin = { install };

export default _default;
