import { logDebug, loadScript, hasScript } from './utils'
import pluginConfig from './config'
/**
 * Plugin main class
 */
var inBrowser = typeof window !== 'undefined'

export default class AnalyticsPlugin {
  constructor(id) {
    this.id = id;
  }

  enabled() {
    return pluginConfig.enabled
  }

  enable(val) {
    pluginConfig.enabled = val

    if (inBrowser && !!val && !hasScript() && pluginConfig.loadScript) {
      loadScript(this.id, {
        defer: pluginConfig.defer,
        queryParams: pluginConfig.queryParams
      })
    }
  }

  debugEnabled() {
    return pluginConfig.debug
  }

  debug(val) {
    pluginConfig.debug = val
  }

  dataLayer() {
    if (inBrowser && pluginConfig.enabled) {
      return (window.dataLayer = window.dataLayer || []);
    }
    return false;
  }

  trackView(screenName, path) {
    logDebug('Dispatching TrackView', { screenName, path })

    if (inBrowser && pluginConfig.enabled) {
      let dataLayer = (window.dataLayer = window.dataLayer || [])
      dataLayer.push({
        event: 'content-view',
        'content-name': path,
        'content-view-name': screenName
      })
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
    logDebug('Dispatching event', {
      event,
      category,
      action,
      label,
      value,
      ...rest
    })

    if (inBrowser && pluginConfig.enabled) {
      let dataLayer = (window.dataLayer = window.dataLayer || [])
      dataLayer.push({
        event: event || 'interaction',
        target: category,
        action: action,
        'target-properties': label,
        value: value,
        'interaction-type': noninteraction,
        ...rest
      })
    }
  }
}
