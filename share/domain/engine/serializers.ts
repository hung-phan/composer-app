import { Builder } from "builder-pattern";
import _ from "lodash";

import { Serializable } from "../interfaces";
import getInterfaceByName from "../interfaces/registry";

export function convertToClass<T>(obj: any): T {
  if (_.isArray(obj)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return _.map(obj, convertToClass);
  }

  if (_.isObject(obj) && _.has(obj, "interfaceName")) {
    for (const [key, value] of Object.entries(obj)) {
      if (
        _.isArray(value) ||
        (_.isObject(value) && _.has(value, "interfaceName"))
      ) {
        obj[key] = convertToClass(value);
      }
    }

    return Builder<T>(
      getInterfaceByName<T>((obj as Serializable).interfaceName),
      obj
    ).build();
  }

  return obj;
}

export function encode(
  response: any,
  replacer?: (this: any, key: string, value: any) => any,
  space?: string | number
): string {
  return JSON.stringify(response, replacer, space);
}

export function decode<T>(jsonResp: string): T {
  try {
    return convertToClass<T>(JSON.parse(jsonResp));
  } catch (e) {
    console.error(e);

    throw e;
  }
}
