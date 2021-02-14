import { DEFAULT_CONFIG } from "../src/config";
import VueGtmPlugin from "../src/plugin";

describe("Plugin", () => {
  test("should apply default options", () => {
    const instance: VueGtmPlugin = new VueGtmPlugin("");
    expect(instance.options).toEqual(DEFAULT_CONFIG);
  });

  test("should apply id when passed as string", () => {
    const instance: VueGtmPlugin = new VueGtmPlugin("GTM-DEMO");
    expect(instance.id).toEqual("GTM-DEMO");
  });

  test("should apply id when passed as array", () => {
    const instance: VueGtmPlugin = new VueGtmPlugin(["GTM-DEMO1", "GTM-DEMO2"]);
    expect(instance.id).toEqual(["GTM-DEMO1", "GTM-DEMO2"]);
  });

  test("should apply id when passed as container array", () => {
    const instance: VueGtmPlugin = new VueGtmPlugin([{ id: "DEMO1" }, { id: "DEMO2" }]);
    expect(instance.id).toEqual([{ id: "DEMO1" }, { id: "DEMO2" }]);
  });
});
