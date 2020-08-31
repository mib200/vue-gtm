"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasScript = exports.loadScript = exports.logDebug = void 0;
require("url-search-params-polyfill");
var config_1 = require("./config");
function logDebug(message, args) {
    if (config_1.default.debug) {
        console.log.apply(console, __spread(["VueGtm :"], arguments));
    }
}
exports.logDebug = logDebug;
function loadScript(id, config) {
    if (config === void 0) { config = {}; }
    var win = window, doc = document, script = doc.createElement("script"), dl = "dataLayer";
    win[dl] = win[dl] || [];
    win[dl].push({
        event: "gtm.js",
        "gtm.start": new Date().getTime(),
    });
    if (!id) {
        return;
    }
    script.async = true;
    script.defer = config.defer || false;
    var queryString = new URLSearchParams(__assign({ id: id }, (config.queryParams || {})));
    script.src = "https://www.googletagmanager.com/gtm.js?" + queryString;
    doc.body.appendChild(script);
}
exports.loadScript = loadScript;
function hasScript() {
    return Array.from(document.getElementsByTagName("script")).some(function (script) {
        return script.src.includes("googletagmanager.com/gtm.js");
    });
}
exports.hasScript = hasScript;
