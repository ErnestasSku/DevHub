import { SIDBOX_TASK_URL_PART, SIDBOX_URL } from "src/utils/constants";
import {
  findElementByAttributeRecursively,
  findElementRecursively,
} from "src/utils/domUtils";

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

interface SFField {
  name: string;
  content: string;
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
    return info;
  }
  return new PageInfo(PageType.other, pageUrl);
}

const FIELDS = [
  "Name",
  "Task_Number_Text__c",
  "Details__c",
  "Expected_Functionality__c",
  "Expected_Result__c",
  "Developer_Notes2__c",
];

export function gatherTaskInfo(): SFField[] {
  let elements: NodeListOf<Element> = document.querySelectorAll(
    ".test-id__field-label-container.slds-form-element__label"
  );

  let parents = Array.from(elements).map((el) => el.parentElement);

  let namedParentField: [HTMLElement, string][] = parents.map((x) => {
    let attribute: Attr = x.parentElement.attributes.getNamedItem(
      "data-target-selection-name"
    );

    for (let field of FIELDS) {
      if (attribute.textContent.includes(field)) {
        return [x, field];
      }
    }
    return null;
  });

  namedParentField = namedParentField.filter((x) => x);

  let sfFields = namedParentField.map(([element, field]) =>
    extractInformationFromSFField(element, field)
  );

  return sfFields;
}

function isInField(attributeElement: NamedNodeMap) {
  let attribute: Attr = attributeElement.getNamedItem(
    "data-target-selection-name"
  );

  return FIELDS.some((field) => attribute.textContent.includes(field));
}

function extractInformationFromSFField(
  element: Element,
  field: string
): SFField {
  let foundElement = findElementByAttributeRecursively(
    element,
    "data-output-element-id",
    "output-field"
  );

  if (foundElement != null) {
    return {
      name: field,
      content: foundElement.textContent,
    };
  } else {
    return null;
  }
}
