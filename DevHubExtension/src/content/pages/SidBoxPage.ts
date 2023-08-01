import { findElementByAttributeRecursively } from "src/utils/domUtils";
import { PageInfo, type InfoSidboxPage, type PageType } from "./PageType";

export interface SFField {
  name: string;
  content: string;
}

export interface TaskInfo {
  url: string;
  fields: SFField[];
}

export const FIELDS = [
  "Name",
  "Task_Number_Text__c",
  "Details__c",
  "Expected_Functionality__c",
  "Expected_Result__c",
  "Developer_Notes2__c",
];

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
    if (field == "Details__c") {
      console.log(foundElement.innerHTML);
      return {
        name: field,
        content: foundElement.innerHTML,
      };
    }

    return {
      name: field,
      content: foundElement.textContent,
    };
  } else {
    return null;
  }
}
