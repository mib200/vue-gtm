export interface VueGtmQueryParams {
  gtm_auth: string;
  gtm_preview: string;
  gtm_cookies_win: string;
}

export interface VueGtmUseOptions {
  /**
   * Your GTM single container ID or array of container ids ['GTM-xxxxxx', 'GTM-yyyyyy']
   */
  id: string | string[];
  /**
   * Add url query string when load gtm.js with GTM ID
   */
  queryParams?: VueGtmQueryParams;
  /**
   * Script can be set to `defer` to speed up page load at the cost of less accurate results (in case visitor leaves before script is loaded, which is unlikely but possible). Defaults to false, so the script is loaded `async` by default
   *
   * @default false
   */
  defer?: boolean;
  /**
   * Will add `async` and `defer` to the script tag to not block requests for old browsers that do not support `async`
   *
   * @default false
   */
  compatibility?: boolean;
  /**
   * Plugin can be disabled by setting this to `false` for Ex: `enabled: !!GDPR_Cookie`
   *
   * @default true
   */
  enabled?: boolean;
  /**
   * Whether or not display console logs debugs
   */
  debug?: boolean;
  /**
   * Whether or not to load the GTM Script (Helpful if you are including GTM manually, but need the dataLayer functionality in your components)
   */
  loadScript?: boolean;
  /**
   * Pass the router instance to automatically sync with router
   */
  vueRouter?: any;
  /**
   * Don't trigger events for specified router names (case insensitive)
   */
  ignoredViews?: string[];
  /**
   * Whether or not call `trackView` in `Vue.nextTick`
   */
  trackOnNextTick?: boolean;
}

// @ts-ignore
const config: VueGtmUseOptions = {
  enabled: true,
  debug: false,
  trackOnNextTick: false,
  queryParams: undefined,
  loadScript: true,
  defer: false,
  compatibility: false,
};

export default config;
