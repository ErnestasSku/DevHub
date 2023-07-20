import { storage } from "../storage";
import {
  backgroundAction,
  type IBackgroundActionResponse,
} from "./backgroundAPI";
import { handleContentRequest } from "./contentActionHandler";

// console.log("Hello from background script");

// chrome.runtime.onInstalled.addListener(() => {
//     storage.get().then(console.log);
// });

chrome.runtime.onMessage.addListener(handleContentRequest);

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  if (
    details.tabId &&
    details.url &&
    details.url.startsWith("https://bcline.lightning.force.com/")
  ) {
    chrome.tabs.sendMessage(details.tabId, {
      action: backgroundAction.historyStateUpdated,
      url: details.url,
    });
  }
});
