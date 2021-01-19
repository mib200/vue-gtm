import { App, createApp, DefineComponent, defineComponent } from "vue";
import { createGtm } from "../src/index";
import VueGtmPlugin from "../src/plugin";

describe("Vue.use", () => {
  afterEach(() => {
    const html: HTMLHtmlElement = document.getElementsByTagName("html")[0] as HTMLHtmlElement;
    html.innerHTML = "";
    delete window["dataLayer"];
  });

  test("should append google tag manager script to DOM", () => {
    const appDiv: HTMLDivElement = document.createElement("div");
    appDiv.id = "app";
    document.body.appendChild(appDiv);

    const app: App<Element> = createApp(
      defineComponent({
        name: "App",
        render() {
          return null;
        },
      })
    );

    expect(window["dataLayer"]).toBeUndefined();
    expect(document.scripts.length).toBe(0);

    app.use(createGtm({ id: "GTM-DEMO" }));

    app.mount("#app");

    expect(window["dataLayer"]).toBeDefined();
    expect(document.scripts.length).toBe(1);
    expect(document.scripts.item(0)).toBeDefined();
    expect(document.scripts.item(0)?.src).toBe("https://www.googletagmanager.com/gtm.js?id=GTM-DEMO");
  });

  test("should not append google tag manager script to DOM if disabled", () => {
    const appDiv: HTMLDivElement = document.createElement("div");
    appDiv.id = "app";
    document.body.appendChild(appDiv);

    const app: App<Element> = createApp(
      defineComponent({
        name: "App",
        render() {
          return null;
        },
      })
    );

    expect(window["dataLayer"]).toBeUndefined();
    expect(document.scripts.length).toBe(0);

    app.use(createGtm({ id: "GTM-DEMO", enabled: false }));

    app.mount("#app");

    expect(window["dataLayer"]).toBeUndefined();
    expect(document.scripts.length).toBe(0);
  });

  test("should append google tag manager script to DOM after lazy enable", () => {
    const appDiv: HTMLDivElement = document.createElement("div");
    appDiv.id = "app";
    document.body.appendChild(appDiv);

    const appComponent: DefineComponent = defineComponent({
      name: "App",
      render() {
        return null;
      },
    });

    const app: App<Element> = createApp(appComponent);

    expect(window["dataLayer"]).toBeUndefined();
    expect(document.scripts.length).toBe(0);

    app.use(createGtm({ id: "GTM-DEMO", enabled: false }));

    app.mount("#app");

    const gtmPlugin: VueGtmPlugin = app.config.globalProperties.$gtm;
    expect(gtmPlugin).toBeDefined();

    gtmPlugin.enable(true);

    expect(window["dataLayer"]).toBeDefined();
    expect(document.scripts.length).toBe(1);
    expect(document.scripts.item(0)).toBeDefined();
    expect(document.scripts.item(0)?.src).toBe("https://www.googletagmanager.com/gtm.js?id=GTM-DEMO");
  });
});
