import { Builder, IBuilder } from "builder-pattern";
import { Patch, immerable } from "immer";
import _ from "lodash";
import { Action } from "redux";

import { Id, getRandomUUID } from "../../library/idGenerator";

export abstract class Serializable {
  [immerable] = true;

  abstract interfaceName: string;

  static getInterfaceName<T extends Serializable>(this: new () => T): string {
    return Builder(this).build().interfaceName;
  }

  static builder<T extends Serializable>(this: new () => T): IBuilder<T> {
    return Builder(this) as IBuilder<T>;
  }
}

export class Method extends Serializable {
  interfaceName = "Method";
}

export class Element extends Serializable {
  interfaceName = "Element";

  id: Id = getRandomUUID();

  class?: string;
  stateId?: Id;

  onCreate?: Method[];
  onDestroy?: Method[];
}

export class Node extends Serializable {
  interfaceName = "Node";

  parent?: Id;
  childs?: { [key: Id]: boolean };
  element: Element;

  setParent(id?: Id): void {
    if (id === undefined) {
      delete this.parent;
      return;
    }

    this.parent = id;
  }

  hasChild(id: Id): boolean {
    if (this.childs === undefined) {
      return false;
    }

    return id in this.childs;
  }

  addChild(id: Id): void {
    if (this.childs === undefined) {
      this.childs = {};
    }

    this.childs[id] = true;
  }

  removeChild(id: Id): void {
    if (this.childs === undefined) {
      return;
    }

    delete this.childs[id];

    if (_.isEmpty(this.childs)) {
      delete this.childs;
    }
  }

  removeAllChild(): void {
    delete this.childs;
  }

  replaceChildElement(oldChildId: Id, childElement: Element) {
    for (const [key, value] of Object.entries(this.element)) {
      if (value instanceof Element && value.id === oldChildId) {
        this.element[key] = childElement;
        return;
      } else if (_.isArray(value)) {
        for (let index = value.length - 1; index >= 0; index--) {
          if (
            value[index] instanceof Element &&
            value[index].id === oldChildId
          ) {
            value[index] = childElement;
            return;
          }
        }
      }
    }
  }

  operateElementInList(
    childId: Id,
    func: (index: number, arr: Element[]) => void
  ) {
    for (const value of Object.values(this.element)) {
      if (_.isArray(value)) {
        for (let index = value.length - 1; index >= 0; index--) {
          if (value[index] instanceof Element && value[index].id === childId) {
            func(index, value);

            return;
          }
        }
      }
    }
  }

  addChildElementInList(childId: Id, childElements: Element[]) {
    this.operateElementInList(childId, (__: number, arr: Element[]) => {
      arr.push(...childElements);
    });
  }

  replaceChildElementInList(childId: Id, childElements: Element[]) {
    this.operateElementInList(childId, (index: number, arr: Element[]) => {
      arr.splice(index, 1, ...childElements);
    });
  }

  deleteChildElementInList(childId: Id) {
    this.operateElementInList(childId, (index: number, arr: Element[]) => {
      arr.splice(index, 1);
    });
  }
}

export class Placeholder extends Element {
  interfaceName = "Placeholder";
}

export class DataContainer extends Element {
  interfaceName = "DataContainer";
}

export interface RawDataContainer<T> {
  data: T;
}

export class Response extends Serializable {
  interfaceName = "Response";

  methods: Method[];

  static readonly EMPTY = Response.builder().methods([]).build();
}

export type RequestType = "GET" | "POST";

export class InvokeExternalMethod extends Method {
  interfaceName = "InvokeExternalMethod";

  action: Action;
}

export class UpdateStateMethod extends Method {
  interfaceName = "UpdateStateMethod";

  stateElementId: Id;
  patches: Patch[];
}

export class RenderElementMethod extends Method {
  interfaceName = "RenderElementMethod";

  element: Element;
}

export class BatchRenderElementMethod extends Method {
  interfaceName = "BatchRenderElementMethod";

  elements: Element[];
}

export class UpdateElementMethod extends Method {
  interfaceName = "UpdateElementMethod";

  id: Id;
  element: Element;
}

export class UpdateInListElementMethod extends Method {
  interfaceName = "UpdateInListElementMethod";

  id: Id;
  elements: Element[];
}

export class DeleteInListElementMethod extends Method {
  interfaceName = "DeleteInListElementMethod";

  ids: Id[];
}

export class AddInListElementMethod extends Method {
  interfaceName = "AddInListElementMethod";

  id: Id;
  elements: Element[];
}

export type RequestData<T> = RawDataContainer<T>;

export class HttpMethod<T> extends Method {
  interfaceName = "HttpMethod";

  before?: Method[];
  after?: Method[];
  url: string;
  requestType: RequestType;
  requestData?: RequestData<T>;
  forwardedClientInfo?: ClientInfo<any>;
  stateIds?: Id[];
  onError?: Method[];
  onSuccess?: Method[];
}

export type HttpMethodBuilder<T> = IBuilder<HttpMethod<T>>;

export type ClientInfo<T> = RawDataContainer<T>;

export interface HttpMethodRequestBody<RequestDataType, ClientInfoType> {
  elementStates?: DataContainer[];
  requestData?: RequestData<RequestDataType>;
  clientInfo?: ClientInfo<ClientInfoType>;
}

export class NavigateMethod extends Method {
  interfaceName = "NavigateMethod";

  url: string;
}
