export function findElementRecursively(
  parentElement: Element,
  className: string
): Element {
  const children = parentElement.children;
  for (let i = 0; i < children.length; i++) {
    const childElement = children[i];

    if (childElement.classList.contains(className)) {
      return childElement;
    }

    const foundElement = findElementRecursively(childElement, className);
    if (foundElement) {
      return foundElement;
    }
  }

  return null;
}

export function findElementByAttributeRecursively(
  parentElement: Element | HTMLElement,
  attributeName: string,
  attributeValue: string
): Element {
  const children = parentElement.children;

  for (let i = 0; i < children.length; i++) {
    const childElement = children[i];

    if (childElement.getAttribute(attributeName) === attributeValue) {
      return childElement;
    }

    const foundElement = findElementByAttributeRecursively(
      childElement,
      attributeName,
      attributeValue
    );
    if (foundElement) {
      return foundElement;
    }
  }

  return null;
}
