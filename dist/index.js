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
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var GtmPlugin_1 = require("./GtmPlugin");
var utils_1 = require("./utils");
function install(Vue, initConf) {
    initConf = __assign(__assign({}, config_1.default), initConf);
    config_1.default.id = initConf.id;
    config_1.default.debug = initConf.debug;
    config_1.default.enabled = initConf.enabled;
    config_1.default.loadScript = initConf.loadScript;
    config_1.default.defer = initConf.defer;
    if (initConf.vueRouter) {
        initVueRouterGuard(Vue, initConf);
    }
    Vue.prototype.$gtm = Vue.gtm = new GtmPlugin_1.default(config_1.default.id);
    if (config_1.default.enabled && config_1.default.loadScript) {
        if (Array.isArray(initConf.id)) {
            initConf.id.forEach(function (id) {
                utils_1.loadScript(id, initConf);
            });
        }
        else {
            utils_1.loadScript(initConf.id, initConf);
        }
    }
}
function initVueRouterGuard(Vue, _a) {
    var vueRouter = _a.vueRouter, ignoredViews = _a.ignoredViews, trackOnNextTick = _a.trackOnNextTick;
    if (ignoredViews) {
        ignoredViews = ignoredViews.map(function (view) { return view.toLowerCase(); });
    }
    vueRouter.afterEach(function (to) {
        if (!to.name ||
            (ignoredViews && ignoredViews.indexOf(to.name.toLowerCase()) !== -1)) {
            return;
        }
        var name = to.meta.gtm || to.name;
        var baseUrl = vueRouter.options.base || "";
        var fullUrl = baseUrl;
        if (!fullUrl.endsWith("/")) {
            fullUrl += "/";
        }
        fullUrl += to.fullPath.startsWith("/")
            ? to.fullPath.substr(1)
            : to.fullPath;
        if (trackOnNextTick) {
            Vue.nextTick(function () {
                Vue.gtm.trackView(name, fullUrl);
            });
        }
        else {
            Vue.gtm.trackView(name, fullUrl);
        }
    });
    return ignoredViews;
}
exports.default = { install: install };
