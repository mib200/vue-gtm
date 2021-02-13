import VueGtm, { createGtm, useGtm } from "../src/index";
import { appendAppDivToBody, cleanUpDataLayer, createAppWithComponent } from "./vue-helper";

describe("Default", () => {
  afterEach(() => {
    cleanUpDataLayer();
  });

  test("should expose Vue plugin", () => {
    expect(VueGtm).toBeDefined();
    expect(VueGtm.install).toBeDefined();
    expect(VueGtm.install).toBeInstanceOf(Function);
  });

  test("should expose useGtm function", () => {
    expect(useGtm).toBeInstanceOf(Function);

    // If the plugin was not used, it returns undefined
    expect(useGtm()).toBeUndefined();

    appendAppDivToBody();
    const { app } = createAppWithComponent();
    app.use(createGtm({ id: "GTM-DEMO" })).mount("#app");

    expect(useGtm()).toBeDefined();
    expect(useGtm()).toStrictEqual(app.config.globalProperties.$gtm);
  });
});
