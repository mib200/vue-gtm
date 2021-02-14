import Vue from "vue";
import { ExtendedVue } from "vue/types/vue";

export function appendAppDivToBody(): void {
  const appDiv: HTMLDivElement = document.createElement("div");
  appDiv.id = "app";
  document.body.appendChild(appDiv);
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function createAppWithComponent() {
  const appComponent: ExtendedVue<Vue, unknown, unknown, unknown, Record<never, any>> = Vue.extend({
    name: "App",
    render(createElement) {
      return createElement("div");
    },
  });
  const app: ExtendedVue<Vue, unknown, unknown, unknown, Record<never, any>> = Vue.extend({
    name: "App",
    render(createElement) {
      return createElement(appComponent);
    },
  });
  return { app, component: appComponent };
}

export function cleanUpDataLayer(): void {
  const html: HTMLHtmlElement = document.getElementsByTagName("html")[0] as HTMLHtmlElement;
  html.innerHTML = "";
  delete window["dataLayer"];
}
