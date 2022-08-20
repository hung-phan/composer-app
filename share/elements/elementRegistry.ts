import { ComponentClass, FunctionComponent } from "react";
import {
  ButtonElement,
  DataElement,
  DefaultTemplate,
  Element,
  ImageElement,
  InputElement,
  LayoutElement,
  PlaceholderElement,
  SelectElement,
  StateHolderElement,
  TableElement,
  TextElement,
} from "share/domain/interfaces";

import { Clazz } from "../../../fuzzy/src/packages/webapp/@types";
import getInterfaceByName from "../domain/interfaces/registry";
import {
  ButtonElementComponent,
  DataElementComponent,
  ImageElementComponent,
  InputElementComponent,
  LayoutElementComponent,
  PlaceholderElementComponent,
  SelectElementComponent,
  StateHolderElementComponent,
  TableElementComponent,
  TextElementComponent,
} from "./components";
import DefaultTemplateElement from "./templates/DefaultTemplateElement";

export interface FuzzyComponentProps {
  elementId: string;
  parentElementId?: string;
}

export interface FuzzyComponentPassedByProps<T> extends FuzzyComponentProps {
  parentProps: T;
}

type ComponentType =
  | ComponentClass<FuzzyComponentProps>
  | FunctionComponent<FuzzyComponentProps>
  | ComponentClass<FuzzyComponentPassedByProps<unknown>>
  | FunctionComponent<FuzzyComponentPassedByProps<unknown>>;

const ELEMENT_REGISTRY = new Map<Clazz<Element>, ComponentType>();

ELEMENT_REGISTRY.set(DefaultTemplate, DefaultTemplateElement);
ELEMENT_REGISTRY.set(LayoutElement, LayoutElementComponent);
ELEMENT_REGISTRY.set(StateHolderElement, StateHolderElementComponent);
ELEMENT_REGISTRY.set(PlaceholderElement, PlaceholderElementComponent);
ELEMENT_REGISTRY.set(ButtonElement, ButtonElementComponent);
ELEMENT_REGISTRY.set(InputElement, InputElementComponent);
ELEMENT_REGISTRY.set(SelectElement, SelectElementComponent);
ELEMENT_REGISTRY.set(DataElement, DataElementComponent);
ELEMENT_REGISTRY.set(TextElement, TextElementComponent);
ELEMENT_REGISTRY.set(ImageElement, ImageElementComponent);
ELEMENT_REGISTRY.set(TableElement, TableElementComponent);

export default function getComponentClass(element: Element): ComponentType {
  const Component: ComponentType | undefined = ELEMENT_REGISTRY.get(
    getInterfaceByName<never>(element.interfaceName)
  );

  if (Component === undefined) {
    throw new Error(`Cannot find component for: ${element.interfaceName}`);
  }

  return Component;
}
