import { storage } from "../storage";
import { backgroundAction } from "../background/backgroundAPI";
import type {
  IBackgroundAction,
  IBackgroundActionResponse,
} from "../background/backgroundAPI";
import { SidboxPageInfo, getPageInfo, PageInfo } from "./contentAPI";

// Some global styles on the page
// import "./styles.css";

// Some JS on the page
// storage.get().then(console.log);

(async () => {
  const action: IBackgroundAction = { action: backgroundAction.getActiveTab };
  const response = await chrome.runtime.sendMessage(action);
  handleBackgroundResponse(response);
})();

function handleBackgroundResponse(response: IBackgroundActionResponse) {
  switch (response.action) {
    case backgroundAction.getActiveTab:
      handleGetActiveTab(response);
      break;
    default:
      console.log("Unknown action");
      break;
  }
}

function handleGetActiveTab(response: IBackgroundActionResponse) {
  let page: PageInfo = getPageInfo(response.data);

  if (page instanceof SidboxPageInfo) {
    waitForElementToExist(".slds-page-header__title").then((el) => {
      if (el instanceof HTMLElement) {
        let childElement = el.innerHTML;
        let linkElement = document.createElement("a");
        linkElement.href = page.pageUrl;
        linkElement.innerHTML = childElement;
        linkElement.onclick = (el) => {
          el.preventDefault();
        };
        el.appendChild(linkElement);
      }
    });
  } else {
    console.log("Other page");
  }
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
