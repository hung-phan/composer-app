import { Element } from "../domain/interfaces";

export function getElementClassName(
  element: Element,
  className?: string
): string | undefined {
  if (element.class && className) {
    return `${className} ${element.class}`;
  }

  if (element.class) {
    return element.class;
  }

  if (className) {
    return className;
  }

  return undefined;
}
