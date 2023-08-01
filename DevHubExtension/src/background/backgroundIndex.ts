import { SIDBOX_URL } from "src/utils/constants";
import { storage } from "../storage";
import {
  backgroundAction,
  type HistoryStateUpdatedResponse,
  type IBackgroundActionResponse,
} from "./backgroundAPI";
import { handleContentRequest } from "./contentActionHandler";

// chrome.runtime.onInstalled.addListener(() => {
//     storage.get().then(console.log);
// });

chrome.runtime.onMessage.addListener(handleContentRequest);

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  if (details.tabId && details.url) {
    let response: IBackgroundActionResponse<HistoryStateUpdatedResponse> = {
      data: { url: details.url },
      action: backgroundAction.historyStateUpdated,
    };

    chrome.tabs.sendMessage(details.tabId, response);
  }
});
