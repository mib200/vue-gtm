import { logDebug, loadScript, hasScript } from './utils'
import pluginConfig from './config'
/**
 * Plugin main class
 */
var inBrowser = typeof window !== 'undefined'

export default class AnalyticsPlugin {
  enabled() {
    return pluginConfig.enabled
  }

  enable(val) {
    pluginConfig.enabled = val

    if (inBrowser && !!val && !hasScript()) {
      loadScript(pluginConfig.id)
    }
  }

  debugEnabled() {
    return pluginConfig.debug
  }

  debug(val) {
    pluginConfig.debug = val
  }

  trackView(screenName, path) {
    if (inBrowser && pluginConfig.enabled) {
      logDebug('Dispatching TrackView', { screenName, path })

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
    if (inBrowser && pluginConfig.enabled) {
      logDebug('Dispatching event', {
        event,
        category,
        action,
        label,
        value,
        ...rest
      })

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
