
enum backgroundAction {
    getActiveTab = "getActiveTab",
}

interface IBackgroundAction {
    action: backgroundAction;
}

interface IBackgroundActionResponse {
    data: any;
    action: backgroundAction;
}

export { backgroundAction };
export type { IBackgroundAction, IBackgroundActionResponse };
