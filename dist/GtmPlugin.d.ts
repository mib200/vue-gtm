export default class AnalyticsPlugin {
    readonly id: string;
    constructor(id: string);
    enabled(): boolean | undefined;
    enable(val: boolean): void;
    debugEnabled(): boolean | undefined;
    debug(val: boolean): void;
    dataLayer(): false | Record<string, any>[];
    trackView(screenName: string, path: string): void;
    trackEvent({ event, category, action, label, value, noninteraction, ...rest }?: {
        event?: null | undefined;
        category?: null | undefined;
        action?: null | undefined;
        label?: null | undefined;
        value?: null | undefined;
        noninteraction?: boolean | undefined;
    }): void;
}
