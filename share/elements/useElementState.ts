import { useSelector } from "react-redux";

import { selectors } from "../domain/engine";
import { Element, ElementState } from "../domain/interfaces";

export default function useElementState<T extends ElementState<any>>(
  element: Element
): T | undefined {
  return useSelector((state) =>
    selectors.getElementState(state, element.stateId)
  ) as T;
}
