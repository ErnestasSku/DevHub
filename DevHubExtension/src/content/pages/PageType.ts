import { SIDBOX_TASK_URL_PART, SIDBOX_URL } from "src/utils/constants";
import { SidboxPageInfo } from "./SidBoxPage";

export enum PageType {
  Sidbox = "Sidbox",
  Bitbucket = "Bitbucket",
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
export { SidboxPageInfo };
