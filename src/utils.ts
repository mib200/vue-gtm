import "url-search-params-polyfill";
import pluginConfig, { VueGtmUseOptions } from "./config";

/**
 * Console log depending on config debug mode
 *
 * @param message
 */
export function logDebug(message: string, args: Record<string, any>): void {
  if (pluginConfig.debug) {
    console.log("VueGtm :", ...arguments);
  }
}

/**
 * Load GTM script tag
 *
 * @param id GTM ID
 * @param params query params object
 */
export function loadScript(
  id: string,
  config: Pick<VueGtmUseOptions, "defer" | "compatibility" | "queryParams"> = {}
): void {
  const doc: Document = document;
  const script: HTMLScriptElement = doc.createElement("script");

  window.dataLayer = window.dataLayer ?? [];

  window.dataLayer?.push({
    event: "gtm.js",
    "gtm.start": new Date().getTime(),
  });

  if (!id) {
    return;
  }

  script.async = !config.defer;
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  script.defer = Boolean(config.defer || config.compatibility);

  const queryString: URLSearchParams = new URLSearchParams({
    id,
    ...(config.queryParams ?? {}),
  });
  script.src = `https://www.googletagmanager.com/gtm.js?${queryString}`;
  doc.body.appendChild(script);
}

/**
 * Check if GTM script is in the document
 */
export function hasScript(): boolean {
  return Array.from(document.getElementsByTagName("script")).some((script) =>
    script.src.includes("googletagmanager.com/gtm.js")
  );
}
