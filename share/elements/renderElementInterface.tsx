import { Element } from "share/domain/interfaces";

import getComponentClass from "./elementRegistry";

export default function renderElementInterface<
  T extends Record<string, unknown>
>(element: Element, parentElement?: Element, parentProps?: T) {
  const Component = getComponentClass(element);

  return (
    <Component
      key={element.id}
      elementId={element.id}
      parentElementId={
        parentElement !== undefined ? parentElement.id : undefined
      }
      parentProps={parentProps}
    />
  );
}
