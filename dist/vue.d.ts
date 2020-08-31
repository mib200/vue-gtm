import { VueGtmObject, VueGtmPlugin } from "./types";
declare module "vue/types/vue" {
    interface Vue {
        $gtm: VueGtmObject;
    }
    interface VueConstructor {
        gtm: VueGtmObject;
    }
}
declare const VueGtm: VueGtmPlugin;
export default VueGtm;
