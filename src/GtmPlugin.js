import { logDebug } from './utils';
import pluginConfig from './config';
/**
 * Plugin main class
 */
var inBrowser = typeof window !== 'undefined';

export default class AnalyticsPlugin {
	trackView(screenName, path) {
		if (inBrowser) {
			logDebug('Dispatching TrackView', { screenName, path });

			let dataLayer = window.dataLayer = window.dataLayer || [];
			dataLayer.push({
				'event': 'content-view',
				'content-name': path
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
		if (inBrowser) {
			logDebug('Dispatching event', { event, category, action, label, value, ...rest });

			let dataLayer = window.dataLayer = window.dataLayer || [];
			dataLayer.push({
				'event': event || 'interaction',
				'target': category,
				'action': action,
				'target-properties': label,
				'value': value,
				'interaction-type': noninteraction,
				...rest
			});
		}	
	}
}