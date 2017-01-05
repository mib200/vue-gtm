import pluginConfig from './config';

/**
 * Console log depending on config debug mode
 * @param {...*} message
 */
export const logDebug = function (message) {
	if (pluginConfig.debug) {
		console.log('VueGtm :', ...arguments);
	}
};
