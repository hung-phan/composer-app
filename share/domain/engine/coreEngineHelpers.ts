import { Element } from "../interfaces";

export function getSimplifiedElement<T extends Element>(element: T): Element {
  return Element.builder()
    .id(element.id)
    .interfaceName(element.interfaceName)
    .build();
}
