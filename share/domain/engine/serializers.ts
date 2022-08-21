import { Builder } from "builder-pattern";
import _ from "lodash";

import { getInterfaceByName } from "../../elements/registry";
import { Serializable } from "../interfaces";

export function convertToClass<T extends Serializable>(obj: any): T {
  if (_.isArray(obj)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return _.map(obj, convertToClass);
  }

  if (_.isObject(obj)) {
    for (const [key, value] of Object.entries(obj)) {
      obj[key] = convertToClass(value);
    }

    if (_.has(obj, "interfaceName")) {
      return Builder<T>(
        getInterfaceByName<T>((obj as Serializable).interfaceName),
        obj
      ).build();
    }
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

export function decode<T extends Serializable>(jsonResp: string): T {
  try {
    return convertToClass<T>(JSON.parse(jsonResp));
  } catch (e) {
    console.error(e);

    throw e;
  }
}
