import { logDebug } from './utils';
import pluginConfig from './config';
/**
 * Plugin main class
 */
export default class AnalyticsPlugin {
	trackView(screenName, path) {
		logDebug('Dispatching TrackView', { screenName, path });

		let dataLayer = window.dataLayer = window.dataLayer || [];
		dataLayer.push({
			'event': 'content-view',
			'content-name': path
		});
	}

	trackEvent({
		event = null,
		category = null,
		action = null,
		label = null,
		value = null,
		noninteraction = false
	} = {}) {
		logDebug('Dispatching event', { category, action, label, value });

		let dataLayer = window.dataLayer = window.dataLayer || [];
		dataLayer.push({
			'event': event || 'interaction',
			'target': category,
			'action': action,
			'target-properties': label,
			'value': value,
			'interaction-type': noninteraction
		});
	}
	
}