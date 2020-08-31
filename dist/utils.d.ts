import "url-search-params-polyfill";
import { VueGtmUseOptions } from "./types";
export declare function logDebug(message: string, args: Record<string, any>): void;
export declare function loadScript(id: string, config?: Pick<VueGtmUseOptions, "defer" | "queryParams">): void;
export declare function hasScript(): boolean;
