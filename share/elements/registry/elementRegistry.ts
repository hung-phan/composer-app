import { Clazz } from "@types";
import _ from "lodash";
import { ComponentClass, FunctionComponent } from "react";

import { DataContainer, Element } from "../../domain/interfaces";
import { DataContainerComponent } from "../components";
import { getInterfaceByName, registerInterfaces } from "./interfaceRegistry";

export interface EngineComponentProps {
  elementId: string;
  parentElementId?: string;
}

export interface EngineComponentWithParentProps<T>
  extends EngineComponentProps {
  parentProps: T;
}

export type ComponentType =
  | ComponentClass<EngineComponentProps>
  | FunctionComponent<EngineComponentProps>
  | ComponentClass<EngineComponentWithParentProps<unknown>>
  | FunctionComponent<EngineComponentWithParentProps<unknown>>;

const ELEMENT_REGISTRY = new Map<Clazz<Element>, ComponentType>();

export function registerElements(
  data: Array<{
    interfaceClass: Clazz<Element>;
    dataContainerClass?: Clazz<DataContainer>;
    elementClass: ComponentType;
  }>
): void {
  for (const { interfaceClass, elementClass, dataContainerClass } of data) {
    registerInterfaces([interfaceClass]);

    if (dataContainerClass !== undefined) {
      registerInterfaces([dataContainerClass]);
    }

    ELEMENT_REGISTRY.set(interfaceClass, elementClass);

    if (dataContainerClass) {
      ELEMENT_REGISTRY.set(dataContainerClass, DataContainerComponent);
    }
  }
}

export function getComponentClass(element: Element): ComponentType {
  const Component: ComponentType | undefined = ELEMENT_REGISTRY.get(
    getInterfaceByName<never>(element.interfaceName)
  );

  if (Component === undefined) {
    throw new Error(`Cannot find component for: ${element.interfaceName}`);
  }

  return Component;
}
