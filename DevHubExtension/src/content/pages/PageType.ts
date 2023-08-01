import {
  BITBUCKET_URL,
  SIDBOX_TASK_URL_PART,
  SIDBOX_URL,
} from "src/utils/constants";
import type { InfoSidboxPage } from "./SidBoxPage";

export enum PageType {
  Sidbox = "Sidbox",
  Bitbucket = "Bitbucket",
  other = "other",
}

export interface IPageInfo {
  pageType: PageType;
  pageUrl: string;
}

interface IBitbucket {
  pullRequestOpen: boolean;
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

export class BitbucketPage extends PageInfo implements IBitbucket {
  pullRequestOpen: boolean;

  constructor(pageType: PageType, pageUrl: string, pullRequestOpen: boolean) {
    super(pageType, pageUrl);
    this.pullRequestOpen = pullRequestOpen;
  }

  static checkIfPullRequestOpen(pageUrl: string): boolean {
    let pattern = /pull-requests\/d*/;
    return pattern.test(pageUrl);
  }
}

export function getPageInfo(data: any): PageInfo {
  const pageUrl = data;
  if (pageUrl.includes(SIDBOX_URL)) {
    let openedTask = pageUrl.includes(SIDBOX_TASK_URL_PART);

    let info = new SidboxPageInfo(PageType.Sidbox, pageUrl, openedTask);
    return info;
  } else if (pageUrl.includes(BITBUCKET_URL)) {
    let prOpen = BitbucketPage.checkIfPullRequestOpen(pageUrl);

    let info = new BitbucketPage(PageType.Bitbucket, pageUrl, prOpen);
    return info;
  }
  return new PageInfo(PageType.other, pageUrl);
}
