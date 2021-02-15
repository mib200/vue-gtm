import { App, nextTick, Plugin } from "vue";
import { DEFAULT_CONFIG, VueGtmContainer, VueGtmQueryParams, VueGtmUseOptions } from "./config";
import GtmPlugin from "./plugin";
import { loadScript } from "./utils";

let gtmPlugin: GtmPlugin | undefined;
const GTM_ID_PATTERN: RegExp = /^GTM-[0-9A-Z]+$/;

/**
 * Assert that the given id is a valid GTM Container ID.
 *
 * Tested against pattern: `/^GTM-[0-9A-Z]+$/`.
 *
 * @param id A GTM Container ID.
 */
function assertIsGtmId(id: string): asserts id {
  if (typeof id !== "string" || !GTM_ID_PATTERN.test(id)) {
    throw new Error(`GTM-ID '${id}' is not valid`);
  }
}

/**
 * Installation procedure.
 *
 * @param app The Vue app instance.
 * @param options Configuration options.
 */
function install(app: App, options: VueGtmUseOptions = { id: "" }): void {
  if (Array.isArray(options.id)) {
    for (const idOrObject of options.id) {
      if (typeof idOrObject === "string") {
        assertIsGtmId(idOrObject);
      } else {
        assertIsGtmId(idOrObject.id);
      }
    }
  } else {
    assertIsGtmId(options.id);
  }

  // Apply default configuration
  options = { ...DEFAULT_CONFIG, ...options };

  // Add to vue prototype and also from globals
  gtmPlugin = new GtmPlugin(options.id, options);
  app.config.globalProperties.$gtm = gtmPlugin;

  // Handle vue-router if defined
  if (options.vueRouter) {
    initVueRouterGuard(app, options.vueRouter, options.ignoredViews, options.trackOnNextTick);
  }

  // Load GTM script when enabled
  if (gtmPlugin.options.enabled && gtmPlugin.options.loadScript) {
    if (Array.isArray(options.id)) {
      options.id.forEach((id: string | VueGtmContainer) => {
        if (typeof id === "string") {
          loadScript(id, options);
        } else {
          const newConf: VueGtmUseOptions = {
            ...options,
          };

          if (id.queryParams != null) {
            newConf.queryParams = {
              ...newConf.queryParams,
              ...id.queryParams,
            } as VueGtmQueryParams;
          }

          loadScript(id.id, newConf);
        }
      });
    } else {
      loadScript(options.id, options);
    }
  }

  app.provide("gtm", options);
}

/**
 * Initialize the router guard.
 *
 * @param app The Vue app instance.
 * @param vueRouter The Vue router instance to attach the guard.
 * @param ignoredViews An array of route name that will be ignored.
 * @param trackOnNextTick Whether or not to call `trackView` in `Vue.nextTick`.
 *
 * @returns The ignored routes names normalized.
 */
function initVueRouterGuard(
  app: App,
  vueRouter: VueGtmUseOptions["vueRouter"],
  ignoredViews: VueGtmUseOptions["ignoredViews"] = [],
  trackOnNextTick: VueGtmUseOptions["trackOnNextTick"]
): string[] | undefined {
  if (!vueRouter) {
    console.warn("[VueGtm]: You tried to register 'vueRouter' for vue-gtm, but 'vue-router' was not found.");
    return;
  }

  // Flatten routes name
  ignoredViews = ignoredViews.map((view) => view.toLowerCase());

  vueRouter.afterEach((to) => {
    // Ignore some routes
    if (typeof to.name !== "string" || ignoredViews.indexOf(to.name.toLowerCase()) !== -1) {
      return;
    }

    // Dispatch vue event using meta gtm value if defined otherwise fallback to route name
    const name: string = to.meta && typeof to.meta.gtm === "string" && !!to.meta.gtm ? to.meta.gtm : to.name;
    const additionalEventData: Record<string, any> = to.meta?.gtmAdditionalEventData ?? {};
    // @ts-expect-error: check RouterOptions.base. Should it be `vueRouter.options.history.base`?
    const baseUrl: string = vueRouter.options.base || "";
    let fullUrl: string = baseUrl;
    if (!fullUrl.endsWith("/")) {
      fullUrl += "/";
    }
    fullUrl += to.fullPath.startsWith("/") ? to.fullPath.substr(1) : to.fullPath;

    if (trackOnNextTick) {
      void nextTick(() => {
        gtmPlugin?.trackView(name, fullUrl, additionalEventData);
      });
    } else {
      gtmPlugin?.trackView(name, fullUrl, additionalEventData);
    }
  });

  return ignoredViews;
}

/**
 * Create the Vue GTM instance.
 *
 * @param options Options.
 * @returns The Vue GTM plugin instance.
 */
export function createGtm(options: VueGtmUseOptions): VueGtmPlugin {
  return { install: (app: App) => install(app, options) };
}

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    /**
     * The Vue GTM Plugin instance.
     */
    $gtm: GtmPlugin;
  }
}

/**
 * Vue GTM Plugin.
 */
export type VueGtmPlugin = Plugin;
export { VueGtmUseOptions } from "./config";

const _default: VueGtmPlugin = { install };

export default _default;

/**
 * Returns GTM plugin instance to be used via Composition API inside setup method.
 *
 * @returns The Vue GTM instance if the it was installed, otherwise `undefined`.
 */
export function useGtm(): GtmPlugin | undefined {
  return gtmPlugin;
}
