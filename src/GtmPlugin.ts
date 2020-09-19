import { logDebug, loadScript, hasScript } from "./utils";
import pluginConfig from "./config";

const inBrowser: boolean = typeof window !== "undefined";

/**
 * Plugin main class
 */
export default class AnalyticsPlugin {
  constructor(public readonly id: string | string[]) {}

  enabled() {
    return pluginConfig.enabled;
  }

  enable(val: boolean) {
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

  debugEnabled() {
    return pluginConfig.debug;
  }

  debug(val: boolean) {
    pluginConfig.debug = val;
  }

  dataLayer() {
    if (inBrowser && pluginConfig.enabled) {
      return (window.dataLayer = window.dataLayer || []);
    }
    return false;
  }

  trackView(screenName: string, path: string) {
    logDebug("Dispatching TrackView", { screenName, path });

    if (inBrowser && pluginConfig.enabled) {
      let dataLayer = (window.dataLayer = window.dataLayer || []);
      dataLayer.push({
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
  } = {}) {
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
