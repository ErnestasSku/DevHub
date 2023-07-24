import { SIDBOX_TASK_URL_PART, SIDBOX_URL } from "src/utils/constants";

export enum PageType {
  Sidbox = "Sidbox",
  other = "other",
}

export interface IPageInfo {
  pageType: PageType;
  pageUrl: string;
}

export interface InfoSidboxPage {
  openedTask: boolean;
}

export class PageInfo implements IPageInfo {
  pageType: PageType;
  pageUrl: string;

  constructor(pageType: PageType, pageUrl: string) {
    this.pageType = pageType;
    this.pageUrl = pageUrl;
  }
}

export class SidboxPageInfo extends PageInfo implements InfoSidboxPage {
  openedTask: boolean;

  constructor(
    pageType: PageType,
    pageUrl: string,
    openedTask: boolean = false
  ) {
    super(pageType, pageUrl);
    this.openedTask = openedTask;
  }
}

export function getPageInfo(data: any): PageInfo {
  const pageUrl = data;
  if (pageUrl.includes(SIDBOX_URL)) {
    let openedTask = pageUrl.includes(SIDBOX_TASK_URL_PART);

    let info = new SidboxPageInfo(PageType.Sidbox, pageUrl, openedTask);
    console.log(info);
    return info;
  }
  return new PageInfo(PageType.other, pageUrl);
}

export function gatherInfoTest() {
  let elements: NodeListOf<Element> = document.querySelectorAll(
    ".test-id__field-label-container.slds-form-element__label"
  );

  let parents = Array.from(elements).map((el) => el.parentElement);
  parents.forEach((el) => {
    console.log(el);
    // el.childNodes.forEach((child) => {
    //   console.log(child);
    // });
  });
}
