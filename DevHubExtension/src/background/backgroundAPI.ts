enum backgroundAction {
  getActiveTab = "getActiveTab",
  historyStateUpdated = "historyStateUpdated",
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
