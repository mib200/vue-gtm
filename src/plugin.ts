import pluginConfig from "./config";
import { hasScript, loadScript, logDebug } from "./utils";

const inBrowser: boolean = typeof window !== "undefined";

export interface VueGtmTrackEventParams {
  [key: string]: any;
  event?: any;
  category?: any;
  action?: any;
  label?: any;
  value?: any;
  noninteraction?: boolean;
}

/**
 * Plugin main class
 */
export default class VueGtmPlugin {
  constructor(public readonly id: string | string[]) {}

  /**
   * Check if plugin is enabled
   */
  enabled(): boolean {
    return pluginConfig.enabled ?? true;
  }

  /**
   * Enable or disable plugin
   *
   * @param val state
   */
  enable(val: boolean): void {
    pluginConfig.enabled = val;

    if (inBrowser && !!val && !hasScript() && pluginConfig.loadScript) {
      if (Array.isArray(this.id)) {
        this.id.forEach((id) => {
          loadScript(id, {
            defer: pluginConfig.defer,
            queryParams: pluginConfig.queryParams,
          });
        });
      } else {
        loadScript(this.id, {
          defer: pluginConfig.defer,
          queryParams: pluginConfig.queryParams,
        });
      }
    }
  }

  /**
   * Check if plugin is in debug mode
   */
  debugEnabled(): boolean {
    return pluginConfig.debug ?? false;
  }

  /**
   * Enable or disable debug mode
   *
   * @param val state
   */
  debug(val: boolean): void {
    pluginConfig.debug = val;
  }

  dataLayer(): Array<Record<string, any>> | false {
    if (inBrowser && pluginConfig.enabled) {
      return (window.dataLayer = window.dataLayer || []);
    }
    return false;
  }

  trackView(screenName: string, path: string, additionalEventData: Record<string, any> = {}): void {
    logDebug("Dispatching TrackView", { screenName, path });

    if (inBrowser && pluginConfig.enabled) {
      let dataLayer = (window.dataLayer = window.dataLayer || []);
      dataLayer.push({
        ...additionalEventData,
        event: "content-view",
        "content-name": path,
        "content-view-name": screenName,
      });
    }
  }

  trackEvent({
    event = null,
    category = null,
    action = null,
    label = null,
    value = null,
    noninteraction = false,
    ...rest
  }: VueGtmTrackEventParams = {}): void {
    logDebug("Dispatching event", {
      event,
      category,
      action,
      label,
      value,
      ...rest,
    });

    if (inBrowser && pluginConfig.enabled) {
      let dataLayer = (window.dataLayer = window.dataLayer || []);
      dataLayer.push({
        event: event || "interaction",
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
