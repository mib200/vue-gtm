import Vue from "vue";
import { CombinedVueInstance } from "vue/types/vue";
import VueGtm, { useGtm } from "../src/index";
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
    const fakeVueInstance: typeof Vue = (null as unknown) as typeof Vue;
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

  test.skip("should expose useGtm function", () => {
    expect(useGtm).toBeInstanceOf(Function);

    // If the plugin was not used, it returns undefined
    expect(useGtm()).toBeUndefined();

    appendAppDivToBody();
    const { app } = createAppWithComponent();

    Vue.use(VueGtm, { id: "GTM-DEMO", enabled: false });

    // eslint-disable-next-line @typescript-eslint/ban-types
    const vue: CombinedVueInstance<Vue, object, object, object, Record<never, any>> = new Vue({
      render: (h) => h(app),
    }).$mount("#app");

    expect(useGtm()).toBeDefined();
    expect(useGtm()).toStrictEqual(vue.$gtm);
  });
});
