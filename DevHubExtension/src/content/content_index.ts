import { features, storage } from "../storage";
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
  type TaskInfo,
} from "./contentAPI";
import {
  LOCAL_SERVER_URL,
  SIDBOX_TASK_TITLE_SELECTOR,
} from "src/utils/constants";

// Some global styles on the page
// import "./styles.css";

// Some JS on the page
// storage.get().then(console.log);

let currentPage: PageInfo = null;
let infoGatherTimer = null;

(async () => {
  const action: IBackgroundAction = { action: backgroundAction.getActiveTab };
  const response = await chrome.runtime.sendMessage(action);
  handleBackgroundResponse(response);
})();

chrome.runtime.onMessage.addListener(
  (request: IBackgroundActionResponse<any>, sender, sendResponse) => {
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
      features.get().then((x) => {
        if (x.task_link) {
          applyLinkBack(currentPage);
        }
        if (x.experimental) {
          observeInfo();
        }
      });
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
      linkElement.ondblclick = (elem) => {
        let bolded = document.createElement("b");
        bolded.innerHTML = linkElement.outerHTML;
        elem.preventDefault();
        const clipboardItem = new ClipboardItem({
          "text/plain": new Blob([el.innerText], { type: "text/plain" }),
          "text/html": new Blob([bolded.outerHTML], {
            type: "text/html",
          }),
        });

        setTimeout(() => {
          navigator.clipboard.write([clipboardItem]);
        }, 100);
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
      infoGatherTimer = debounce(sendInfoToTauri());
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

function sendInfoToTauri() {
  let info = gatherTaskInfo();
  console.log(info[0]);

  let body: TaskInfo = {
    url: currentPage.pageUrl,
    fields: info,
  };

  fetch(LOCAL_SERVER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
}

function debounce(func, delay = 250) {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
