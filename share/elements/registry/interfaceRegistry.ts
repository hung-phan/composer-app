import { Clazz } from "@types";
import * as _ from "lodash";
import { Serializable } from "share/domain/interfaces";

const INTERFACE_REGISTRY: { [key: string]: Clazz<Serializable> } = {};

export function registerInterfaces(interfaces: Array<Clazz<Serializable>>) {
  for (const currentInterface of interfaces) {
    // @ts-ignore
    if (!_.isFunction(currentInterface.getInterfaceName)) {
      throw new Error(`Invalid Engine interface: ${currentInterface}`);
    }

    // @ts-ignore
    const interfaceName: string = currentInterface.getInterfaceName();

    if (interfaceName in INTERFACE_REGISTRY) {
      throw new Error("Duplicated interface registered");
    }

    INTERFACE_REGISTRY[interfaceName] = currentInterface;
  }
}

export function getInterfaceByName<T extends Serializable>(
  interfaceName: string
): Clazz<T> {
  if (!_.has(INTERFACE_REGISTRY, interfaceName)) {
    throw new Error(`Cannot find interface with name: ${interfaceName}`);
  }

  return INTERFACE_REGISTRY[interfaceName] as Clazz<T>;
}
