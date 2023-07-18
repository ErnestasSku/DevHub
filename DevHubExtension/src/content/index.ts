import { storage } from "../storage";
import { backgroundAction } from "../background/backgroundAPI";
import type {
  IBackgroundAction,
  IBackgroundActionResponse,
} from "../background/backgroundAPI";
import type PageInfo from "./contentAPI";
import { SidboxPageInfo, getPageInfo } from "./contentAPI";

// Some global styles on the page
// import "./styles.css";

// Some JS on the page
storage.get().then(console.log);

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
  console.log(response);
  let page: PageInfo = getPageInfo(response.data);

  if (page instanceof SidboxPageInfo) {
    waitForElementToExist(".slds-page-header__title").then((el) => {
      if (el instanceof HTMLElement) {
        let childElement = el.innerHTML;
        el.innerHTML = `<a href="${page.pageUrl}">${childElement}</a>`;
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
