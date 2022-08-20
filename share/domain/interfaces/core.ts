import { Builder, IBuilder } from "builder-pattern";
import { immerable } from "immer";
import getNewId from "../../library/idGenerator";

export abstract class Serializable {
  [immerable] = true;

  abstract interfaceName: string;
}

export class Method extends Serializable {
  interfaceName = "Method";

  static getInterfaceName() {
    return this.builder().build().interfaceName;
  }

  static builder(): IBuilder<Method> {
    return Builder(Method);
  }
}

export type Id = string;

export class Element extends Serializable {
  interfaceName = "Element";

  id: Id = getNewId();

  class?: string;
  stateId?: string;

  onCreate?: Method[];
  onDestroy?: Method[];

  static getInterfaceName() {
    return this.builder().build().interfaceName;
  }

  static builder(): IBuilder<Element> {
    return Builder(Element);
  }
}

export class PlaceholderElement extends Element {
  interfaceName = "PlaceholderElement";

  static builder(): IBuilder<PlaceholderElement> {
    return Builder(PlaceholderElement);
  }
}

export interface DataContainer<T> {
  data: T;
}

export type ElementState<T> = DataContainer<T>

export class StateHolderElement<T extends ElementState<any>> extends Element {
  interfaceName = "StateHolderElement";

  elementState: T;

  static builder<T extends ElementState<any>>(): IBuilder<StateHolderElement<T>> {
    return Builder(StateHolderElement<T>);
  }
}

export class Response extends Serializable {
  interfaceName = "Response";

  methods: Method[];

  static getInterfaceName() {
    return this.builder().build().interfaceName;
  }

  static builder(): IBuilder<Response> {
    return Builder(Response);
  }

  static readonly EMPTY = Response.builder().methods([]).build();
}

export type RequestType = "GET" | "POST";

export class InvokeExternalMethod extends Method {
  interfaceName = "InvokeExternalMethod";

  type: string;
  payload: unknown;

  static getInterfaceName() {
    return this.builder().build().interfaceName;
  }

  static builder(): IBuilder<InvokeExternalMethod> {
    return Builder(InvokeExternalMethod);
  }
}

export class RenderElementMethod extends Method {
  interfaceName = "RenderElementMethod";

  element: Element;

  static builder(): IBuilder<RenderElementMethod> {
    return Builder(RenderElementMethod);
  }
}

export class UpdateElementMethod extends Method {
  interfaceName = "UpdateElementMethod";

  id: Id;
  element: Element;

  static builder(): IBuilder<UpdateElementMethod> {
    return Builder(UpdateElementMethod);
  }
}

export class UpdateInListElementMethod extends Method {
  interfaceName = "UpdateInListElementMethod";

  id: Id;
  elements: Element[];

  static builder(): IBuilder<UpdateInListElementMethod> {
    return Builder(UpdateInListElementMethod);
  }
}

export type RequestData<T> = DataContainer<T>

export class HttpMethod<T> extends Method {
  interfaceName = "HttpMethod";

  before?: Method[];
  after?: Method[];
  url: string;
  requestType: RequestType;
  requestData?: RequestData<T>;
  clientStateId?: string;
  onError?: Method[];
  onSuccess?: Method[];

  static builder<T>(): IBuilder<HttpMethod<T>> {
    return Builder(HttpMethod<T>);
  }
}

export type ClientInfo<T> = DataContainer<T>;

export interface HttpMethodRequestBody<T, S extends ElementState<any>, G extends ClientInfo<any>> {
  requestData?: RequestData<T>;
  elementState?: S;
  clientInfo?: G;
}

export class NavigateMethod extends Method {
  interfaceName = "NavigateMethod";

  url: string;

  static builder(): IBuilder<NavigateMethod> {
    return Builder(NavigateMethod);
  }
}
