import VueGtm from "../src/index";

describe("Default", () => {
  test("should expose Vue plugin", () => {
    expect(VueGtm).toBeDefined();
    expect(VueGtm.install).toBeDefined();
    expect(VueGtm.install).toBeInstanceOf(Function);
  });
});
