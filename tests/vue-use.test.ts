import Vue from "vue";
import { CombinedVueInstance, ExtendedVue } from "vue/types/vue";
import VueGtm from "../src/index";
import VueGtmPlugin from "../src/plugin";

// TODO: Find out why Vue in vue-2 is undefined

// Skip for now
describe.skip("Vue.use", () => {
  afterEach(() => {
    const html: HTMLHtmlElement = document.getElementsByTagName("html")[0] as HTMLHtmlElement;
    html.innerHTML = "";
    delete window["dataLayer"];
  });

  test("should append google tag manager script to DOM", () => {
    const appDiv: HTMLDivElement = document.createElement("div");
    appDiv.id = "app";
    document.body.appendChild(appDiv);

    const app: ExtendedVue<Vue, unknown, unknown, unknown, Record<never, any>> = Vue.extend({
      name: "App",
      render(createElement) {
        return createElement("div");
      },
    });

    expect(window["dataLayer"]).toBeUndefined();
    expect(document.scripts.length).toBe(0);

    Vue.use(VueGtm, { id: "GTM-DEMO" });

    new Vue({
      render: (h) => h(app),
    }).$mount("#app");

    expect(window["dataLayer"]).toBeDefined();
    expect(document.scripts.length).toBe(1);
    expect(document.scripts.item(0)).toBeDefined();
    expect(document.scripts.item(0)?.src).toBe("https://www.googletagmanager.com/gtm.js?id=GTM-DEMO");
  });

  test("should append multiple google tag manager scripts to DOM", () => {
    const appDiv: HTMLDivElement = document.createElement("div");
    appDiv.id = "app";
    document.body.appendChild(appDiv);

    const app: ExtendedVue<Vue, unknown, unknown, unknown, Record<never, any>> = Vue.extend({
      name: "App",
      render(createElement) {
        return createElement("div");
      },
    });

    expect(window["dataLayer"]).toBeUndefined();
    expect(document.scripts.length).toBe(0);

    Vue.use(VueGtm, {
      id: [
        { id: "GTM-DEMO", queryParams: { gtm_auth: "abc123", gtm_preview: "env-1", gtm_cookies_win: "x" } },
        { id: "GTM-DEMO2", queryParams: { gtm_auth: "abc234", gtm_preview: "env-2", gtm_cookies_win: "x" } },
      ],
    });

    new Vue({
      render: (h) => h(app),
    }).$mount("#app");

    expect(window["dataLayer"]).toBeDefined();
    expect(document.scripts.length).toBe(2);
    expect(document.scripts.item(0)).toBeDefined();
    expect(document.scripts.item(0)?.src).toBe(
      "https://www.googletagmanager.com/gtm.js?id=GTM-DEMO&gtm_auth=abc123&gtm_preview=env-1&gtm_cookies_win=x"
    );
    expect(document.scripts.item(1)?.src).toBe(
      "https://www.googletagmanager.com/gtm.js?id=GTM-DEMO2&gtm_auth=abc234&gtm_preview=env-2&gtm_cookies_win=x"
    );
  });

  test("should not append google tag manager script to DOM if disabled", () => {
    const appDiv: HTMLDivElement = document.createElement("div");
    appDiv.id = "app";
    document.body.appendChild(appDiv);

    const app: ExtendedVue<Vue, unknown, unknown, unknown, Record<never, any>> = Vue.extend({
      name: "App",
      render(createElement) {
        return createElement("div");
      },
    });

    expect(window["dataLayer"]).toBeUndefined();
    expect(document.scripts.length).toBe(0);

    Vue.use(VueGtm, { id: "GTM-DEMO", enabled: false });

    new Vue({
      render: (h) => h(app),
    }).$mount("#app");

    expect(window["dataLayer"]).toBeUndefined();
    expect(document.scripts.length).toBe(0);
  });

  test("should append google tag manager script to DOM after lazy enable", () => {
    const appDiv: HTMLDivElement = document.createElement("div");
    appDiv.id = "app";
    document.body.appendChild(appDiv);

    const appComponent: ExtendedVue<Vue, unknown, unknown, unknown, Record<never, any>> = Vue.extend({
      name: "App",
      render(createElement) {
        return createElement("div");
      },
    });

    expect(window["dataLayer"]).toBeUndefined();
    expect(document.scripts.length).toBe(0);

    Vue.use(VueGtm, { id: "GTM-DEMO", enabled: false });

    // eslint-disable-next-line @typescript-eslint/ban-types
    const vue: CombinedVueInstance<Vue, object, object, object, Record<never, any>> = new Vue({
      render: (h) => h(appComponent),
    }).$mount("#app");

    const gtmPlugin: VueGtmPlugin = vue.$gtm;
    expect(gtmPlugin).toBeDefined();

    gtmPlugin.enable(true);

    expect(window["dataLayer"]).toBeDefined();
    expect(document.scripts.length).toBe(1);
    expect(document.scripts.item(0)).toBeDefined();
    expect(document.scripts.item(0)?.src).toBe("https://www.googletagmanager.com/gtm.js?id=GTM-DEMO");
  });
});
