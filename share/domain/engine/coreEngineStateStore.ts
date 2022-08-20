import produce, {
  Patch,
  applyPatches,
  enableMapSet,
  enablePatches,
  setAutoFreeze,
} from "immer";
import * as _ from "lodash";
import { DefaultRootState } from "react-redux";
import actionCreatorFactory from "typescript-fsa";
import { reducerWithInitialState } from "typescript-fsa-reducers";
import { asyncFactory } from "typescript-fsa-redux-thunk";

import {
  Element,
  ElementState,
  HttpMethod,
  Id,
  StateHolderElement,
} from "../interfaces";
import { engineDispatch } from "./coreEngine";
import { ROOT_ID } from "./index";

enableMapSet();
enablePatches();
setAutoFreeze(false);

export interface Container {
  parent?: Id;
  element?: Element;
  childs?: Id[];
}

export type State = {
  [key: Id]: Container;
};

export const mountPoint = "templateEngine";

export const selectors = {
  getState: (state: DefaultRootState): State => state[mountPoint],
  getElement: (state: DefaultRootState, id: Id): Element | undefined => {
    const node = state[mountPoint][id];

    if (!node) {
      throw new Error(`Cannot find state for ${id}`);
    }

    return node.element;
  },
  getElementState: <T extends ElementState<any>>(
    state: DefaultRootState,
    id: Id
  ): T | undefined => {
    const element = state[mountPoint][id].element;

    if (element === undefined) {
      return undefined;
    }

    if (!(element instanceof StateHolderElement)) {
      throw new Error("Current element is not a StateHolderElement");
    }

    return element.elementState as T;
  },
};

const actionCreator = actionCreatorFactory(mountPoint);
const asyncActionCreator = asyncFactory<DefaultRootState>(actionCreator);

export enum ActionType {
  CALL_ENDPOINT = "CALL_ENDPOINT",
  SET_ELEMENT = "SET_ELEMENT",
  DEL_ELEMENT = "DEL_ELEMENT",
  REGISTER_PARENT = "REGISTER_PARENT",
  REPLACE_ELEMENT = "REPLACE_ELEMENT",
  REPLACE_ELEMENT_IN_LIST = "REPLACE_ELEMENT_IN_LIST",
  UPDATE_STATE_ELEMENT = "UPDATE_STATE_ELEMENT",
}

export const actions = {
  callEndpoint: asyncActionCreator<HttpMethod<any>, State>(
    ActionType.CALL_ENDPOINT,
    async (method, dispatch, getRootState) => {
      await engineDispatch(dispatch, [method]);

      return selectors.getState(getRootState());
    }
  ),
  setElement: actionCreator<{ element: Element }>(ActionType.SET_ELEMENT),
  delElement: actionCreator<{ id: Id; interfaceName: string }>(
    ActionType.DEL_ELEMENT
  ),
  registerParent: actionCreator<{ ids: Id[]; parentId: Id }>(
    ActionType.REGISTER_PARENT
  ),
  replaceElement: actionCreator<{
    oldId: Id;
    id: Id;
  }>(ActionType.REPLACE_ELEMENT),
  replaceElementInList: actionCreator<{
    oldId: Id;
    ids: Id[];
  }>(ActionType.REPLACE_ELEMENT_IN_LIST),
  updateStateElement: actionCreator<{
    stateElementId: string;
    patches: Patch[];
  }>(ActionType.UPDATE_STATE_ELEMENT),
};

function replaceElement(
  oldId: string,
  element: Element,
  parentElement: Element
): void {
  for (const [key, value] of Object.entries(parentElement)) {
    if (value instanceof Element && value.id === oldId) {
      parentElement[key] = element;
      return;
    } else if (_.isArray(value)) {
      for (let index = 0, len = value.length; index < len; index++) {
        if (value[index] instanceof Element && value[index].id === oldId) {
          value[index] = element;
          return;
        }
      }
    }
  }
}

function replaceElementInList(
  oldId: string,
  elements: Element[],
  parentElement: Element
): void {
  for (const value of Object.values(parentElement)) {
    if (_.isArray(value)) {
      for (let index = 0, len = value.length; index < len; index++) {
        if (value[index] instanceof Element && value[index].id === oldId) {
          value.splice(index, 1, ...elements);

          return;
        }
      }
    }
  }
}

const EMPTY_ARRAY = [];

function getChilds(state: State, id: Id): Id[] {
  return state[id].childs !== undefined ? state[id].childs : EMPTY_ARRAY;
}

function deleteAllChildElements(state: State, id: Id): void {
  if (!(id in state)) {
    return;
  }

  for (const child of getChilds(state, id)) {
    deleteAllChildElements(state, child);
  }

  delete state[id];
}

export const reducer = reducerWithInitialState<State>({})
  .case(actions.setElement, (state, action) =>
    produce(state, (draft) => {
      const element = action.element;

      if (!(element.id in draft)) {
        draft[element.id] = {};
      }

      draft[element.id].element = element;

      const parentId = draft[element.id].parent;

      if (parentId === undefined) {
        return;
      }

      const parentElement = draft[parentId].element;

      replaceElement(
        element.id,
        Element.builder()
          .id(element.id)
          .interfaceName(element.interfaceName)
          .build(),
        parentElement
      );
    })
  )
  .case(actions.delElement, (state, action) =>
    produce(state, (draft) => {
      if (
        action.id in draft &&
        action.interfaceName === draft[action.id].element.interfaceName
      ) {
        let id = action.id;
        let pointer = draft[id];

        while (pointer.parent !== undefined) {
          const currentId = id;

          id = pointer.parent;
          pointer = draft[id];

          if (!_.find(getChilds(draft, id), (child) => child === currentId)) {
            deleteAllChildElements(draft, currentId);
            return;
          }
        }

        if (id !== ROOT_ID) {
          delete draft[action.id];
        }
      }
    })
  )
  .case(actions.registerParent, (state, action) =>
    produce(state, (draft) => {
      if (!(action.parentId in draft)) {
        draft[action.parentId] = {};
      }

      draft[action.parentId].childs = [];

      for (const id of action.ids) {
        if (
          !_.find(getChilds(draft, action.parentId), (child) => child === id)
        ) {
          if (draft[action.parentId].childs === undefined) {
            draft[action.parentId].childs = [];
          }

          draft[action.parentId].childs.push(id);

          if (!(id in draft)) {
            draft[id] = {};
          }

          draft[id].parent = action.parentId;
        }
      }
    })
  )
  .case(actions.replaceElement, (state, action) =>
    produce(state, (draft) => {
      const parentId = draft[action.oldId].parent;

      if (parentId === undefined) {
        return;
      }

      const parentElement = draft[parentId].element;
      const newElement = draft[action.id].element;

      replaceElement(
        action.oldId,
        Element.builder()
          .id(newElement.id)
          .interfaceName(newElement.interfaceName)
          .build(),
        parentElement
      );

      draft[action.oldId].parent = undefined;

      const childs = getChilds(state, parentId);
      if (childs.length > 0) {
        draft[parentId].childs = childs.filter(
          (child) => child !== action.oldId
        );
      }

      draft[action.id].parent = parentId;
      draft[parentId].childs.push(action.id);
    })
  )
  .case(actions.replaceElementInList, (state, action) =>
    produce(state, (draft) => {
      const parentId = draft[action.oldId].parent;

      if (parentId === undefined) {
        return;
      }

      const parentElement = draft[parentId].element;
      const newElements = action.ids.map((id) => draft[id].element);

      replaceElementInList(
        action.oldId,
        newElements.map((newElement) =>
          Element.builder()
            .id(newElement.id)
            .interfaceName(newElement.interfaceName)
            .build()
        ),
        parentElement
      );

      draft[action.oldId].parent = undefined;

      const childs = getChilds(state, parentId);
      if (childs.length > 0) {
        draft[parentId].childs = childs.filter(
          (child) => child !== action.oldId
        );
      }

      for (const id of action.ids) {
        draft[id].parent = parentId;
        draft[parentId].childs.push(id);
      }
    })
  )
  .case(actions.updateStateElement, (state, action) =>
    produce(state, (draft) => {
      const element = draft[action.stateElementId].element;

      if (!(element instanceof StateHolderElement)) {
        throw new Error("Can only update state of StateHolderElement");
      }

      applyPatches(element.elementState, action.patches);
    })
  );
