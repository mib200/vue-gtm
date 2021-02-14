import { DEFAULT_CONFIG, VueGtmContainer, VueGtmUseOptions } from "./config";
import { hasScript, loadScript } from "./utils";

/**
 * Object within the `window.dataLayer`.
 *
 * @see [developers.google.com/tag-manager/devguide](https://developers.google.com/tag-manager/devguide)
 */
export interface DataLayerObject extends Record<string, any> {
  event: string;
}

declare global {
  interface Window {
    /**
     * `dataLayer` used by GTM.
     *
     * @see [developers.google.com/tag-manager/devguide](https://developers.google.com/tag-manager/devguide)
     */
    dataLayer?: DataLayerObject[];
  }
}

/**
 * Whether the script is running in a browser or not.
 */
const inBrowser: boolean = typeof window !== "undefined";

/**
 * Object definition for a track event.
 */
export interface VueGtmTrackEventParams {
  [key: string]: any;
  event?: string;
  category?: any;
  action?: any;
  label?: any;
  value?: any;
  noninteraction?: boolean;
}

/**
 * The Vue GTM Plugin main class.
 */
export default class VueGtmPlugin {
  /**
   * Constructs a new `VueGTMPlugin`.
   *
   * @param id A GTM Container ID.
   * @param options Options.
   */
  constructor(
    public readonly id: string | string[] | VueGtmContainer[],
    public readonly options: Pick<VueGtmUseOptions, keyof typeof DEFAULT_CONFIG | "queryParams"> = DEFAULT_CONFIG
  ) {}

  /**
   * Check if plugin is enabled.
   *
   * @returns `true` if the plugin is enabled, otherwise `false`.
   */
  enabled(): boolean {
    return this.options.enabled ?? true;
  }

  /**
   * Enable or disable plugin.
   *
   * When enabling with this function, the script will be attached to the `document` if:
   *
   * - the script runs in browser context
   * - the `document` doesn't have the script already attached
   * - the `loadScript` option is set to `true`
   *
   * @param enabled `true` to enable, `false` to disable. Default: `true`.
   */
  enable(enabled: boolean = true): void {
    this.options.enabled = enabled;

    if (inBrowser && enabled && !hasScript() && this.options.loadScript) {
      if (Array.isArray(this.id)) {
        this.id.forEach((id: string | VueGtmContainer) => {
          if (typeof id === "string") {
            loadScript(id, {
              defer: this.options.defer,
              compatibility: this.options.compatibility,
              queryParams: this.options.queryParams,
            });
          } else {
            loadScript(id.id, {
              defer: this.options.defer,
              compatibility: this.options.compatibility,
              queryParams: id.queryParams,
            });
          }
        });
      } else {
        loadScript(this.id, {
          defer: this.options.defer,
          compatibility: this.options.compatibility,
          queryParams: this.options.queryParams,
        });
      }
    }
  }

  /**
   * Check if plugin is in debug mode.
   *
   * @returns `true` if the plugin is in debug mode, otherwise `false`.
   */
  debugEnabled(): boolean {
    return this.options.debug ?? false;
  }

  /**
   * Enable or disable debug mode.
   *
   * @param enable `true` to enable, `false` to disable.
   */
  debug(enable: boolean): void {
    this.options.debug = enable;
  }

  /**
   * Returns the `window.dataLayer` array if the script is running in browser context and the plugin is enabled,
   * otherwise `false`.
   *
   * @returns The `window.dataLayer` if script is running in browser context and plugin is enabled, otherwise `false`.
   */
  dataLayer(): DataLayerObject[] | false {
    if (inBrowser && this.options.enabled) {
      return (window.dataLayer = window.dataLayer ?? []);
    }
    return false;
  }

  /**
   * Track a view event with `event: "content-view"`.
   *
   * The event will only be send if the script runs in browser context and the if plugin is enabled.
   *
   * If debug mode is enabled, a "Dispatching TrackView" is logged,
   * regardless of whether the plugin is enabled or the plugin is being executed in browser context.
   *
   * @param screenName Name of the screen passed as `"content-view-name"`.
   * @param path Path passed as `"content-name"`.
   * @param additionalEventData Additional data for the event object. `event`, `"content-name"` and `"content-view-name"` will always be overridden.
   */
  trackView(screenName: string, path: string, additionalEventData: Record<string, any> = {}): void {
    if (this.options.debug) {
      console.log("[VueGtm]: Dispatching TrackView", { screenName, path });
    }

    if (inBrowser && this.options.enabled) {
      const dataLayer: DataLayerObject[] = (window.dataLayer = window.dataLayer ?? []);
      dataLayer.push({
        ...additionalEventData,
        event: "content-view",
        "content-name": path,
        "content-view-name": screenName,
      });
    }
  }

  /**
   * Track an event.
   *
   * The event will only be send if the script runs in browser context and the if plugin is enabled.
   *
   * If debug mode is enabled, a "Dispatching event" is logged,
   * regardless of whether the plugin is enabled or the plugin is being executed in browser context.
   *
   * @param param0 Object that will be used for configuring the event object passed to GTM.
   * @param param0.event `event`, default to `"interaction"` when pushed to `window.dataLayer`.
   * @param param0.category Optional `category`, passed as `target`.
   * @param param0.action Optional `action`, passed as `action`.
   * @param param0.label Optional `label`, passed as `"target-properties"`.
   * @param param0.value Optional `value`, passed as `value`.
   * @param param0.noninteraction Optional `noninteraction`, passed as `"interaction-type"`.
   */
  trackEvent({
    event,
    category = null,
    action = null,
    label = null,
    value = null,
    noninteraction = false,
    ...rest
  }: VueGtmTrackEventParams = {}): void {
    if (this.options.debug) {
      console.log("[VueGtm]: Dispatching event", {
        event,
        category,
        action,
        label,
        value,
        ...rest,
      });
    }

    if (inBrowser && this.options.enabled) {
      const dataLayer: DataLayerObject[] = (window.dataLayer = window.dataLayer ?? []);
      dataLayer.push({
        event: event ?? "interaction",
        target: category,
        action: action,
        "target-properties": label,
        value: value,
        "interaction-type": noninteraction,
        ...rest,
      });
    }
  }
}
