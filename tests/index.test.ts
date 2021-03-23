import type { App } from "vue";
import VueGtm, { createGtm, useGtm } from "../src/index";
import { appendAppDivToBody, createAppWithComponent, resetDataLayer, resetHtml } from "./vue-helper";

describe("Default", () => {
  afterEach(() => {
    resetHtml();
    resetDataLayer();
  });

  test("should expose Vue plugin", () => {
    expect(VueGtm).toBeDefined();
    expect(VueGtm.install).toBeDefined();
    expect(VueGtm.install).toBeInstanceOf(Function);
  });

  test("should throw Error if GTM-ID is invalid", () => {
    const validGtmId: string = "GTM-X";
    const invalidGtmIds: string[] = ["GTM-x", "a", "gtm-a", "Error: ", "Error"];
    const fakeVueInstance: App = (null as unknown) as App;
    for (const invalidGtmId of invalidGtmIds) {
      const expectedErrorMessage: string = `GTM-ID '${invalidGtmId}' is not valid`;
      expect(() => {
        VueGtm.install?.(fakeVueInstance, { id: invalidGtmId });
      }).toThrowError(new Error(expectedErrorMessage));
      expect(() => {
        VueGtm.install?.(fakeVueInstance, { id: [invalidGtmId] });
      }).toThrowError(new Error(expectedErrorMessage));
      expect(() => {
        VueGtm.install?.(fakeVueInstance, { id: [validGtmId, invalidGtmId] });
      }).toThrowError(new Error(expectedErrorMessage));
      expect(() => {
        VueGtm.install?.(fakeVueInstance, { id: [{ id: invalidGtmId }] });
      }).toThrowError(new Error(expectedErrorMessage));
      expect(() => {
        VueGtm.install?.(fakeVueInstance, { id: [{ id: validGtmId }, { id: invalidGtmId }] });
      }).toThrowError(new Error(expectedErrorMessage));
    }
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
