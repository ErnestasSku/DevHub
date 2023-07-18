
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

    constructor(pageType: PageType, pageUrl: string, openedTask: boolean = false) {
        super(pageType, pageUrl);
        this.openedTask = openedTask;
    }
}

export function getPageInfo(data: any): PageInfo {
    const pageUrl = data.url;
    if (pageUrl.includes("bcline.lightning.force.com")) {
        let openedTask = pageUrl.includes("lightning.force.com/lightning/r/Task__c/");        
        return new SidboxPageInfo(PageType.Sidbox, pageUrl, openedTask);
    }
    return new PageInfo(PageType.other, pageUrl);
}
