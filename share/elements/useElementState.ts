import { useSelector } from "react-redux";

import { selectors } from "../domain/engine";
import { DataContainer, Element } from "../domain/interfaces";
import { RootState } from "../store";

export default function useElementState<T extends DataContainer>(
  element: Element
): T {
  return useSelector<RootState, Element>((state) =>
    selectors.getElementState(state, element.stateId)
  ) as T;
}
