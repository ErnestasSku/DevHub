import type {
  IBackgroundAction,
  IBackgroundActionResponse,
} from "../background/backgroundAPI";
import { backgroundAction } from "../background/backgroundAPI";

function handleContentRequest(
  request: IBackgroundAction,
  sender: any,
  sendResponse: any
) {
  switch (request.action) {
    case backgroundAction.getActiveTab:
      return handleGetActiveTab(sendResponse, request.action);
    default:
      console.log("Unknown action");
      break;
  }
}

function handleGetActiveTab(sendResponse: any, action: backgroundAction) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];

    let response: IBackgroundActionResponse<chrome.tabs.Tab> = {
      data: activeTab,
      action: action,
    };

    sendResponse(response);
  });
  return true;
}

export { handleContentRequest };
