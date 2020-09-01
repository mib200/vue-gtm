import Vue from "vue";

import { VueGtmObject, VueGtmPlugin } from "./types";

declare const VueGtm: VueGtmPlugin;
export default VueGtm;

declare module "vue/types/vue" {
  interface Vue {
    $gtm: VueGtmObject;
  }
  interface VueConstructor {
    gtm: VueGtmObject;
  }
}
