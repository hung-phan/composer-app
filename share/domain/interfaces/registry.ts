import * as _ from "lodash";

import { Clazz } from "../../../../fuzzy/src/packages/webapp/@types";
import * as core from "./core";
import * as widgets from "./widgets";

const INTERFACE_REGISTRY = [
  // core
  core.Method,
  core.InvokeExternalMethod,
  core.Element,
  core.StateHolderElement,
  core.PlaceholderElement,
  core.RenderElementMethod,
  core.UpdateElementMethod,
  core.UpdateInListElementMethod,
  core.HttpMethod,
  core.NavigateMethod,
  core.Response,

  // widgets
  widgets.DefaultTemplate,
  widgets.LayoutElement,
  widgets.DataElement,
  widgets.TextElement,
  widgets.ImageElement,
  widgets.ButtonElement,
  widgets.TableElement,
  widgets.InputElement,
  widgets.SelectElement,
].reduce((previousValue, clazz) => {
  previousValue[clazz.getInterfaceName()] = clazz;

  return previousValue;
}, {});

export default function getInterfaceByName<T>(interfaceName: string): Clazz<T> {
  if (!_.has(INTERFACE_REGISTRY, interfaceName)) {
    throw new Error(`Cannot find interface with name: ${interfaceName}`);
  }

  return INTERFACE_REGISTRY[interfaceName];
}
