import type Router from "vue-router";

/**
 * Query parameter object that will be send to GTM.
 */
export interface VueGtmQueryParams {
  /**
   * GTM auth environment parameter.
   */
  gtm_auth: string;
  /**
   * GTM preview environment parameter.
   */
  gtm_preview: string;
  /**
   * GTM cookies win environment parameter.
   */
  gtm_cookies_win: string;
}

/**
 * GTM ID Container.
 */
export interface VueGtmContainer {
  /**
   * GTM Container ID.
   */
  id: string;
  /**
   * Add url query string when load gtm.js with GTM ID.
   */
  queryParams?: VueGtmQueryParams;
}

/**
 * Options passed to the plugin.
 */
export interface VueGtmUseOptions {
  // eslint-disable-next-line spellcheck/spell-checker
  /**
   * Your GTM single container ID, array of container ids or array of objects.
   *
   * @example
   *     'GTM-xxxxxx'
   *     // or
   *     ['GTM-xxxxxx', 'GTM-yyyyyy']
   *     // or
   *     [{
   *       id: 'GTM-xxxxxx',
   *       queryParams: {
   *         gtm_auth: 'abc123',
   *         gtm_preview: 'env-4',
   *         gtm_cookies_win: 'x'
   *       }
   *     }, {
   *       id: 'GTM-yyyyyy',
   *       queryParams: {
   *         gtm_auth: 'abc234',
   *         gtm_preview: 'env-5',
   *         gtm_cookies_win: 'x'
   *       }
   *     }]
   */
  id: string | string[] | VueGtmContainer[];
  /**
   * Add url query string when load gtm.js with GTM ID.
   */
  queryParams?: VueGtmQueryParams;
  /**
   * Script can be set to `defer` to speed up page load at the cost of less accurate results (in case visitor leaves before script is loaded, which is unlikely but possible).
   *
   * Defaults to false, so the script is loaded `async` by default.
   *
   * @default false
   */
  defer?: boolean;
  /**
   * Will add `async` and `defer` to the script tag to not block requests for old browsers that do not support `async`.
   *
   * @default false
   */
  compatibility?: boolean;
  /**
   * Will add `nonce` to the script tag.
   *
   * @see [Using Google Tag Manager with a Content Security Policy](https://developers.google.com/tag-manager/web/csp)
   */
  nonce?: string;
  /**
   * Plugin can be disabled by setting this to `false`.
   *
   * @example enabled: !!GDPR_Cookie
   *
   * @default true
   */
  enabled?: boolean;
  /**
   * Whether or not to display console logs debugs.
   */
  debug?: boolean;
  /**
   * Whether or not to load the GTM Script.
   *
   * Helpful if you are including GTM manually, but need the dataLayer functionality in your components.
   */
  loadScript?: boolean;
  /**
   * Pass the router instance to automatically sync with router.
   */
  vueRouter?: Router;
  /**
   * Don't trigger events for specified router names (case insensitive).
   */
  ignoredViews?: string[];
  /**
   * Whether or not call `trackView` in `Vue.nextTick`.
   */
  trackOnNextTick?: boolean;
}

/**
 * Default configuration for the plugin.
 */
export const DEFAULT_CONFIG: Readonly<{
  enabled: true;
  debug: false;
  trackOnNextTick: false;
  loadScript: true;
  defer: false;
  compatibility: false;
}> = {
  enabled: true,
  debug: false,
  trackOnNextTick: false,
  loadScript: true,
  defer: false,
  compatibility: false,
} as const;
