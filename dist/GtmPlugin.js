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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var config_1 = require("./config");
var inBrowser = typeof window !== "undefined";
var AnalyticsPlugin = (function () {
    function AnalyticsPlugin(id) {
        this.id = id;
    }
    AnalyticsPlugin.prototype.enabled = function () {
        return config_1.default.enabled;
    };
    AnalyticsPlugin.prototype.enable = function (val) {
        config_1.default.enabled = val;
        if (inBrowser && !!val && !utils_1.hasScript() && config_1.default.loadScript) {
            utils_1.loadScript(this.id, {
                defer: config_1.default.defer,
                queryParams: config_1.default.queryParams,
            });
        }
    };
    AnalyticsPlugin.prototype.debugEnabled = function () {
        return config_1.default.debug;
    };
    AnalyticsPlugin.prototype.debug = function (val) {
        config_1.default.debug = val;
    };
    AnalyticsPlugin.prototype.dataLayer = function () {
        if (inBrowser && config_1.default.enabled) {
            return (window.dataLayer = window.dataLayer || []);
        }
        return false;
    };
    AnalyticsPlugin.prototype.trackView = function (screenName, path) {
        utils_1.logDebug("Dispatching TrackView", { screenName: screenName, path: path });
        if (inBrowser && config_1.default.enabled) {
            var dataLayer = (window.dataLayer = window.dataLayer || []);
            dataLayer.push({
                event: "content-view",
                "content-name": path,
                "content-view-name": screenName,
            });
        }
    };
    AnalyticsPlugin.prototype.trackEvent = function (_a) {
        if (_a === void 0) { _a = {}; }
        var _b = _a.event, event = _b === void 0 ? null : _b, _c = _a.category, category = _c === void 0 ? null : _c, _d = _a.action, action = _d === void 0 ? null : _d, _e = _a.label, label = _e === void 0 ? null : _e, _f = _a.value, value = _f === void 0 ? null : _f, _g = _a.noninteraction, noninteraction = _g === void 0 ? false : _g, rest = __rest(_a, ["event", "category", "action", "label", "value", "noninteraction"]);
        utils_1.logDebug("Dispatching event", __assign({ event: event,
            category: category,
            action: action,
            label: label,
            value: value }, rest));
        if (inBrowser && config_1.default.enabled) {
            var dataLayer = (window.dataLayer = window.dataLayer || []);
            dataLayer.push(__assign({ event: event || "interaction", target: category, action: action, "target-properties": label, value: value, "interaction-type": noninteraction }, rest));
        }
    };
    return AnalyticsPlugin;
}());
exports.default = AnalyticsPlugin;
