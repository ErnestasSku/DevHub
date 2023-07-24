import { storage } from "../storage";
import {
  backgroundAction,
  type HistoryStateUpdatedResponse,
  type IBackgroundAction,
  type IBackgroundActionResponse,
} from "../background/backgroundAPI";

import {
  SidboxPageInfo,
  getPageInfo,
  PageInfo,
  gatherTaskInfo,
} from "./contentAPI";
import { SIDBOX_TASK_TITLE_SELECTOR } from "src/utils/constants";

// Some global styles on the page
// import "./styles.css";

// Some JS on the page
// storage.get().then(console.log);

let currentPage: PageInfo = null;

(async () => {
  const action: IBackgroundAction = { action: backgroundAction.getActiveTab };
  const response = await chrome.runtime.sendMessage(action);
  handleBackgroundResponse(response);
})();

chrome.runtime.onMessage.addListener(
  (request: IBackgroundActionResponse<any>, sender, sendResponse) => {
    console.log("received");
    checkPage(request.data.url);
  }
);

function handleBackgroundResponse(response: IBackgroundActionResponse<any>) {
  if (response.action === backgroundAction.getActiveTab) {
    handleGetActiveTab(response);
  } else if (response.action === backgroundAction.historyStateUpdated) {
    handleHistoryStateUpdated(response);
  }
}

function handleGetActiveTab(
  response: IBackgroundActionResponse<chrome.tabs.Tab>
) {
  checkPage(response.data.url);
}

function handleHistoryStateUpdated(
  response: IBackgroundActionResponse<HistoryStateUpdatedResponse>
) {
  checkPage(response.data.url);
}

function checkPage(url: string) {
  currentPage = getPageInfo(url);

  if (currentPage instanceof SidboxPageInfo) {
    if (currentPage.openedTask) {
      applyLinkBack(currentPage);
      observeInfo();
    }
  } else {
  }
}

function applyLinkBack(page: PageInfo) {
  waitForElementToExist(SIDBOX_TASK_TITLE_SELECTOR).then((el) => {
    if (el instanceof HTMLElement) {
      let childElement = el.innerHTML;
      let linkElement = document.createElement("a");
      linkElement.href = page.pageUrl;
      linkElement.innerHTML = childElement;
      linkElement.onclick = (elem) => {
        elem.preventDefault();
        const clipboardItem = new ClipboardItem({
          "text/plain": new Blob([el.innerText], { type: "text/plain" }),
          "text/html": new Blob([linkElement.outerHTML], {
            type: "text/html",
          }),
        });
        navigator.clipboard.write([clipboardItem]);
      };
      el.innerHTML = "";
      el.appendChild(linkElement);
    }
  });
}

function observeInfo() {
  waitForElementToExist(
    ".test-id__field-label-container.slds-form-element__label"
  ).then((el) => {
    if (el instanceof HTMLElement) {
      gatherTaskInfo();
    }
  });
}

function waitForElementToExist(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
    });
  });
}
