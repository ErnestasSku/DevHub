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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  checkPage(request.url);
});

function handleBackgroundResponse(response: IBackgroundActionResponse) {
  switch (response.action) {
    case backgroundAction.getActiveTab:
      return handleGetActiveTab(response);
    case backgroundAction.historyStateUpdated:
      // console.log("Contnet: History state updated");
      return handleGetActiveTab(response);
    default:
      console.log("Unknown action");
      break;
  }
}

function handleGetActiveTab(response: IBackgroundActionResponse) {
  checkPage(response.data.url);
}

function checkPage(url: string) {
  let page: PageInfo = getPageInfo(url);

  if (page instanceof SidboxPageInfo) {
    waitForElementToExist(
      "#brandBand_2 > div > div > div.windowViewMode-normal.oneContent.active.lafPageHost > div > div > one-record-home-flexipage2 > forcegenerated-adg-rollup_component___force-generated__flexipage_-record-page___-task_-record_-page___-task__c___-v-i-e-w > forcegenerated-flexipage_task_record_page_task__c__view_js > record_flexipage-desktop-record-page-decorator > div.record-page-decorator > records-record-layout-event-broker > slot > slot > flexipage-record-home-two-col-equal-header-template-desktop2 > div > div.row.region-header.slds-col.slds-size_1-of-1 > slot > flexipage-component2:nth-child(1) > slot > records-lwc-highlights-panel > records-lwc-record-layout > forcegenerated-highlightspanel_task__c___012000000000000aaa___compact___view___recordlayout2 > records-highlights2 > div.highlights.slds-clearfix.slds-page-header.slds-page-header_record-home.fixed-position > div.slds-grid.primaryFieldRow > div.slds-grid.slds-col.slds-has-flexi-truncate > div.slds-media__body > h1 > slot.slds-page-header__title.slds-m-right--small.slds-align-middle.clip-text.slds-line-clamp"
    ).then((el) => {
      console.log("waited", el);
      if (el instanceof HTMLElement) {
        let childElement = el.innerHTML;
        let linkElement = document.createElement("a");
        linkElement.href = page.pageUrl;
        linkElement.innerHTML = childElement;
        linkElement.onclick = (el) => {
          el.preventDefault();
        };
        el.innerHTML = "";
        el.appendChild(linkElement);
      }
    });
  } else {
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
