import Vue, { PluginObject, VueConstructor } from "vue"

declare const VueGtm: VueGtmPlugin
export default VueGtm
export interface VueGtmPlugin extends PluginObject<VueGtmUseOptions> {}

export interface VueGtmTrackEventParams {
  [key: string]: any
  event?: any
  category?: any
  action?: any
  label?: any
  value?: any
  noninteraction?: boolean
}

export interface VueGtmUseOptions {
  /**
   * Your GTM single container ID or array of container ids ['GTM-xxxxxxx', 'GTM-yyyyyyy']
   */
  id: string | string[]
  /**
   * Add url query string when load gtm.js with GTM ID
   */
  queryParams?: {
    gtm_auth: string
    gtm_preview: string
    gtm_cookies_win: string
  }
  /**
   * Script can be set to `defer` to increase page-load-time at the cost of less accurate results (in case visitor leaves before script is loaded, which is unlikely but possible)
   *
   * @default false
   */
  defer?: boolean
  /**
   * Plugin can be disabled by setting this to `false` for Ex: `enabled: !!GDPR_Cookie`
   *
   * @default true
   */
  enabled?: boolean
  /**
   * Whether or not display console logs debugs
   */
  debug?: boolean
  /**
   * Whether or not to load the GTM Script (Helpful if you are including GTM manually, but need the dataLayer functionality in your components)
   */
  loadScript?: boolean
  /**
   * Pass the router instance to automatically sync with router
   */
  vueRouter?: any
  /**
   * If router, you can exclude some routes name (case insensitive)
   */
  ignoredViews?: string[]
}

export interface VueGtmObject {
  /**
   * Check if plugin is enabled
   */
  enabled(): boolean
  /**
   * Enable or disable plugin
   *
   * @param val state
   */
  enable(val: boolean): void
  /**
   * Check if plugin is in debug mode
   */
  debugEnabled(): boolean
  /**
   * Enable or disable debug mode
   *
   * @param val state
   */
  debug(val: boolean): void
  dataLayer(): any
  trackView(screenName: any, path: any): void
  trackEvent({
    event,
    category,
    action,
    label,
    value,
    noninteraction,
    ...rest
  }?: VueGtmTrackEventParams): void
}

declare module "vue/types/vue" {
  interface Vue {
    $gtm: VueGtmObject
  }
  interface VueConstructor {
    gtm: VueGtmObject
  }
}
