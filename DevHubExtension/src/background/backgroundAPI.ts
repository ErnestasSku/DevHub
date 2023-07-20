export enum backgroundAction {
  getActiveTab = "getActiveTab",
  historyStateUpdated = "historyStateUpdated",
}

export interface IBackgroundAction {
  action: backgroundAction;
}

export interface IBackgroundActionResponse<T> {
  action: backgroundAction;
  data: T;
}

export interface HistoryStateUpdatedResponse {
  url: string;
}
