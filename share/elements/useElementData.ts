import { Clazz } from "@types";
import { Builder } from "builder-pattern";
import { useSelector } from "react-redux";

import { selectors } from "../domain/engine";
import { Element } from "../domain/interfaces";
import { RootState } from "../store";

export default function useElementData<T extends Element>(
  elementId: string,
  clazz: Clazz<T>
): T {
  const element = useSelector<RootState, Element>((state) =>
    selectors.getElement(state, elementId)
  );

  if (!(element instanceof clazz)) {
    throw new Error(
      `${element.interfaceName} is not instance of ${
        Builder(clazz).build().interfaceName
      }`
    );
  }

  return element as T;
}
