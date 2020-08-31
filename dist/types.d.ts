import { PluginObject } from "vue";
export interface VueGtmPlugin extends PluginObject<VueGtmUseOptions> {
}
export interface VueGtmTrackEventParams {
    [key: string]: any;
    event?: any;
    category?: any;
    action?: any;
    label?: any;
    value?: any;
    noninteraction?: boolean;
}
export interface VueGtmUseOptions {
    id: string | string[];
    queryParams?: {
        gtm_auth: string;
        gtm_preview: string;
        gtm_cookies_win: string;
    };
    defer?: boolean;
    enabled?: boolean;
    debug?: boolean;
    loadScript?: boolean;
    vueRouter?: any;
    ignoredViews?: string[];
    trackOnNextTick?: boolean;
}
export interface VueGtmObject {
    enabled(): boolean;
    enable(val: boolean): void;
    debugEnabled(): boolean;
    debug(val: boolean): void;
    dataLayer(): any;
    trackView(screenName: any, path: any): void;
    trackEvent({ event, category, action, label, value, noninteraction, ...rest }?: VueGtmTrackEventParams): void;
}
