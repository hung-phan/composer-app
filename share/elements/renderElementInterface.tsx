import { Element } from "share/domain/interfaces";

import { getComponentClass } from "./registry";

export default function renderElementInterface<T>(
  element: Element,
  parentElement?: Element,
  parentProps?: T
) {
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
