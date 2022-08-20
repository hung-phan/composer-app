import { Builder } from "builder-pattern";
import { useSelector } from "react-redux";

import { Clazz } from "../../../fuzzy/src/packages/webapp/@types";
import { selectors } from "../domain/engine";
import { Element } from "../domain/interfaces";

export default function useElementData<T extends Element>(
  elementId: string,
  clazz: Clazz<T>
): T | undefined {
  const element = useSelector((state) =>
    selectors.getElement(state, elementId)
  );

  if (element === undefined) {
    return undefined;
  }

  if (!(element instanceof clazz)) {
    throw new Error(
      `${element.interfaceName} is not instance of ${
        Builder(clazz).build().interfaceName
      }`
    );
  }

  return element as T;
}
