interface DataLayerObject extends Record<string, any> {
  event: string;
}

declare interface Window {
  dataLayer?: DataLayerObject[];
}
