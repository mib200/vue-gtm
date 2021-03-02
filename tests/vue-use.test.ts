import { createGtm } from "../src/index";
import VueGtmPlugin from "../src/plugin";
import { appendAppDivToBody, cleanUpDataLayer, createAppWithComponent } from "./vue-helper";

describe("Vue.use", () => {
  afterEach(() => {
    cleanUpDataLayer();
  });

  test("should append google tag manager script to DOM", () => {
    appendAppDivToBody();
    const { app } = createAppWithComponent();

    expect(window["dataLayer"]).toBeUndefined();
    expect(document.scripts.length).toBe(0);

    app.use(createGtm({ id: "GTM-DEMO" })).mount("#app");

    expect(window["dataLayer"]).toBeDefined();
    expect(document.scripts.length).toBe(1);
    expect(document.scripts.item(0)).toBeDefined();
    expect(document.scripts.item(0)?.src).toBe("https://www.googletagmanager.com/gtm.js?id=GTM-DEMO");
  });

  test("should append multiple google tag manager scripts to DOM", () => {
    appendAppDivToBody();
    const { app } = createAppWithComponent();

    expect(window["dataLayer"]).toBeUndefined();
    expect(document.scripts.length).toBe(0);

    app
      .use(
        createGtm({
          id: [
            { id: "GTM-DEMO", queryParams: { gtm_auth: "abc123", gtm_preview: "env-1", gtm_cookies_win: "x" } },
            { id: "GTM-DEMO2", queryParams: { gtm_auth: "abc234", gtm_preview: "env-2", gtm_cookies_win: "x" } },
          ],
        })
      )
      .mount("#app");

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
    appendAppDivToBody();
    const { app } = createAppWithComponent();

    expect(window["dataLayer"]).toBeUndefined();
    expect(document.scripts.length).toBe(0);

    app.use(createGtm({ id: "GTM-DEMO", enabled: false })).mount("#app");

    expect(window["dataLayer"]).toBeUndefined();
    expect(document.scripts.length).toBe(0);
  });

  test("should append google tag manager script to DOM after lazy enable", () => {
    appendAppDivToBody();
    const { app } = createAppWithComponent();

    expect(window["dataLayer"]).toBeUndefined();
    expect(document.scripts.length).toBe(0);

    app.use(createGtm({ id: "GTM-DEMO", enabled: false })).mount("#app");

    const gtmPlugin: VueGtmPlugin = app.config.globalProperties.$gtm;
    expect(gtmPlugin).toBeDefined();

    gtmPlugin.enable(true);

    expect(window["dataLayer"]).toBeDefined();
    expect(document.scripts.length).toBe(1);
    expect(document.scripts.item(0)).toBeDefined();
    expect(document.scripts.item(0)?.src).toBe("https://www.googletagmanager.com/gtm.js?id=GTM-DEMO");
  });

  test("should expose enable and enabled function", () => {
    appendAppDivToBody();
    const { app } = createAppWithComponent();
    app.use(createGtm({ id: "GTM-DEMO", enabled: false })).mount("#app");

    const gtmPlugin: VueGtmPlugin = app.config.globalProperties.$gtm;

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(gtmPlugin.enable).toBeInstanceOf(Function);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(gtmPlugin.enabled).toBeInstanceOf(Function);

    expect(gtmPlugin.enabled()).toBeFalsy();

    gtmPlugin.enable(true);
    expect(gtmPlugin.enabled()).toBeTruthy();

    gtmPlugin.enable(false);
    expect(gtmPlugin.enabled()).toBeFalsy();

    gtmPlugin.enable(true);
    expect(gtmPlugin.enabled()).toBeTruthy();
  });

  test("should expose debug functions", () => {
    appendAppDivToBody();
    const { app } = createAppWithComponent();
    app.use(createGtm({ id: "GTM-DEMO" })).mount("#app");

    const gtmPlugin: VueGtmPlugin = app.config.globalProperties.$gtm;

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(gtmPlugin.debug).toBeInstanceOf(Function);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(gtmPlugin.debugEnabled).toBeInstanceOf(Function);

    expect(gtmPlugin.debugEnabled()).toBeFalsy();

    gtmPlugin.debug(true);
    expect(gtmPlugin.debugEnabled()).toBeTruthy();

    gtmPlugin.debug(false);
    expect(gtmPlugin.debugEnabled()).toBeFalsy();
  });

  test("should expose dataLayer function", () => {
    appendAppDivToBody();
    const { app } = createAppWithComponent();
    app.use(createGtm({ id: "GTM-DEMO" })).mount("#app");

    const gtmPlugin: VueGtmPlugin = app.config.globalProperties.$gtm;

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(gtmPlugin.dataLayer).toBeInstanceOf(Function);

    expect(gtmPlugin.dataLayer()).toEqual(window["dataLayer"]);

    gtmPlugin.enable(false);
    expect(gtmPlugin.dataLayer()).toBeFalsy();

    gtmPlugin.enable(true);
    expect(gtmPlugin.dataLayer()).toEqual(window["dataLayer"]);
  });

  test("should allow dataLayer to be called with no event, without Typescript error", () => {
    appendAppDivToBody();
    const { app } = createAppWithComponent();
    app.use(createGtm({ id: "GTM-DEMO" })).mount("#app");

    const gtmPlugin: VueGtmPlugin = app.config.globalProperties.$gtm;

    const dataLayer = gtmPlugin.dataLayer();
    if (dataLayer) dataLayer.push({ "user-id": "user-123" });

    expect(window["dataLayer"]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          "user-id": "user-123",
        }),
      ])
    );
  });

  test("should expose trackView function", () => {
    appendAppDivToBody();
    const { app } = createAppWithComponent();
    app.use(createGtm({ id: "GTM-DEMO" })).mount("#app");

    const gtmPlugin: VueGtmPlugin = app.config.globalProperties.$gtm;

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(gtmPlugin.trackView).toBeInstanceOf(Function);

    gtmPlugin.trackView("ScreenName", "Path");

    expect(window["dataLayer"]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          event: "gtm.js",
          "gtm.start": expect.any(Number),
        }),
        expect.objectContaining({
          "content-name": "Path",
          "content-view-name": "ScreenName",
          event: "content-view",
        }),
      ])
    );
  });

  test("should expose trackEvent function", () => {
    appendAppDivToBody();
    const { app } = createAppWithComponent();
    app.use(createGtm({ id: "GTM-DEMO" })).mount("#app");

    const gtmPlugin: VueGtmPlugin = app.config.globalProperties.$gtm;

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(gtmPlugin.trackEvent).toBeInstanceOf(Function);

    gtmPlugin.trackEvent();

    expect(window["dataLayer"]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          event: "gtm.js",
          "gtm.start": expect.any(Number),
        }),
        expect.objectContaining({
          action: null,
          event: "interaction",
          "interaction-type": false,
          target: null,
          "target-properties": null,
          value: null,
        }),
      ])
    );
  });
});
