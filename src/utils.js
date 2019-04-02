import pluginConfig from './config'

/**
 * Console log depending on config debug mode
 * @param {...*} message
 */
export const logDebug = function (message) {
  if (pluginConfig.debug) {
    console.log('VueGtm :', ...arguments)
  }
}

/**
 * Load GTM script tag
 * @param {String}  id  GTM ID
 */
export const loadScript = function (id, queryParams) {
  const win    = window,
        doc    = document,
        script = doc.createElement('script'),
        dl     = 'dataLayer'

  win[dl] = win[dl] || []

  win[dl].push({
    event      :'gtm.js',
    'gtm.start': new Date().getTime(),
  })

  if (!id) {
    return
  }

  let querys = []
  for (const [key, value] of Object.entries(queryParams)) {
    querys.push(key + '=' + value)
  }

  script.async = true;
  script.src   = `https://www.googletagmanager.com/gtm.js?id=${id}&${querys.join('&')}`

  doc.body.appendChild(script)
}

/**
 * Check if GTM script is in the document
 * @return {boolean}
 */
export const hasScript = function () {
  return Array
    .from(document.getElementsByName('script'))
    .some(script => script.src.includes('googletagmanager'))
}
