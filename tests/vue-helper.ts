import { App, createApp, defineComponent } from "vue";

export function appendAppDivToBody(): void {
  const appDiv: HTMLDivElement = document.createElement("div");
  appDiv.id = "app";
  document.body.appendChild(appDiv);
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function createAppWithComponent() {
  // eslint-disable-next-line @typescript-eslint/typedef
  const appComponent = defineComponent({
    name: "App",
    render() {
      return null;
    },
  });
  const app: App<Element> = createApp(appComponent);
  return { app, component: appComponent };
}

export function cleanUpDataLayer(): void {
  const html: HTMLHtmlElement = document.getElementsByTagName("html")[0] as HTMLHtmlElement;
  html.innerHTML = "";
  delete window["dataLayer"];
}
