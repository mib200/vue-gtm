import Vue, { PluginFunction } from "vue"

declare const VueGtm: VueGtm
export default VueGtm
export interface VueGtm {
  install: PluginFunction<VueGtmUseOptions>
}

export interface VueGtmUseOptions {
  /**
   * Your GTM single container ID or array of container ids ['GTM-xxxxxxx', 'GTM-yyyyyyy']
   */
  id: string | string[]
  /**
   * Add url query string when load gtm with GTM ID
   */
  queryParams?: {
    gtm_auth: string
    gtm_preview: string
    gtm_cookies_win: string
  }
  /**
   * Defaults to `true`. Plugin can be disabled by setting this to `false` for Ex: `enabled: !!GDPR_Cookie`
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
   * @param val state
   */
  enable(val: boolean): void
  /**
   * Check if plugin is in debug mode
   */
  debugEnabled(): boolean
  /**
   * Enable or disable debug mode
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
  }?: {
    event?: any
    category?: any
    action?: any
    label?: any
    value?: any
    noninteraction?: boolean
  }): void
}

declare module "vue/types/vue" {
  interface Vue {
    $gtm: VueGtmObject
  }
}
