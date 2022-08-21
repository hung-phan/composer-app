import {
  Draft,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import {
  Patch,
  applyPatches,
  enableMapSet,
  enablePatches,
  setAutoFreeze,
} from "immer";
import _ from "lodash";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { Id } from "share/library/idGenerator";

import { Template } from "../../elements/templateComponents/templates";
import { RootState } from "../../store";
import { DataContainer, Element, Method, Node } from "../interfaces";
import { engineDispatch } from "./coreEngine";
import { getSimplifiedElement } from "./coreEngineHelpers";
import { GLOBAL_OWNER_ID, ROOT_ID } from "./index";

enableMapSet();
enablePatches();
setAutoFreeze(false);

export type State = {
  [key: Id]: Node;
};

export var mountPoint = "templateEngine";

export var selectors = {
  getState: (state: RootState): State => state[mountPoint],
  getCurrentTemplateOwnerId: (state: RootState): Id => {
    const node: Node = state[mountPoint][ROOT_ID];

    if (node === undefined) {
      return GLOBAL_OWNER_ID;
    }

    const element = node.element;

    if (!(element instanceof Template)) {
      return element.id;
    }

    return element.ownerId;
  },
  getElement: (state: RootState, id: Id | undefined): Element => {
    if (id === undefined) {
      throw new Error("Get 'undefined' id");
    }

    const node: Node = state[mountPoint][id];

    if (node === undefined) {
      throw new Error(`Cannot find element with ${id}`);
    }

    return node.element;
  },
  getParentElement: (state: RootState, id: Id): Element => {
    const childNode: Node = state[mountPoint][id];

    if (childNode === undefined) {
      throw new Error(`Cannot find element with ${id}`);
    }

    const parentId = childNode.parent;

    if (parentId === undefined) {
      throw new Error(`Cannot find parent of element ${id}`);
    }

    const parentNode = state[mountPoint][parentId];

    if (parentNode === undefined) {
      throw new Error(`Find undefined parent for id ${parentId}`);
    }

    return parentNode.element;
  },
  getElementState: <T extends DataContainer>(
    state: RootState,
    id: Id | undefined
  ): T => {
    const element = selectors.getElement(state, id);

    if (!(element instanceof DataContainer)) {
      throw new Error("Current element is not a DataContainer");
    }

    return element as T;
  },
};

function* yieldElementAndChildIds(
  state: State,
  id: Id
): Generator<string, any, any> {
  const childs = state[id]?.childs;

  if (childs) {
    for (const child of Object.keys(childs)) {
      yield* yieldElementAndChildIds(state, child);
    }
  }

  yield id;
}

function deleteElement(state: State, currentId: Id): void {
  for (const id of yieldElementAndChildIds(state, currentId)) {
    delete state[id];
  }
}

function createNodeIfNotExist(state: State, id: Id) {
  if (id in state) {
    return;
  }

  state[id] = Node.builder().build();
}

const initialState: State = {};

const slice = createSlice({
  name: mountPoint,
  initialState,
  reducers: {
    handleCoreEngineActions: (state, action: PayloadAction<AnyAction[]>) => {
      for (const coreEngineAction of action.payload) {
        slice.caseReducers[_.last(coreEngineAction.type.split("/")) as string](
          state,
          coreEngineAction
        );
      }
    },
    setElement: (
      state: Draft<State>,
      action: PayloadAction<{ element: Element; childIds: Id[] }>
    ) => {
      const [element, childIds] = [
        action.payload.element,
        new Set(action.payload.childIds),
      ];

      createNodeIfNotExist(state, element.id);

      state[element.id].element = element;

      const parentId = state[element.id]?.parent;

      if (parentId) {
        // do inplace update and convert the current child interface to element interface
        state[parentId].replaceChildElement(
          element.id,
          getSimplifiedElement(element)
        );
      }

      // remove previous childs
      const childs = state[element.id].childs;

      if (childs) {
        for (const childId of Object.keys(childs)) {
          if (!childIds.has(childId)) {
            state[element.id].removeChild(childId);
            deleteElement(state, childId);
          }
        }
      }

      // register parent-child relationship
      for (const childId of childIds) {
        createNodeIfNotExist(state, childId);

        state[childId].setParent(element.id);
        state[element.id].addChild(childId);
      }
    },
    replaceElement: (
      state: Draft<State>,
      action: PayloadAction<{
        parentId: Id;
        oldId: Id;
        id: Id;
      }>
    ) => {
      const oldNode = state[action.payload.oldId];
      const parentNode = state[action.payload.parentId];

      if (parentNode === undefined) {
        return;
      }

      const newNode = state[action.payload.id];

      if (oldNode.parent === parentNode.element.id) {
        oldNode.setParent(undefined);
      }
      newNode.setParent(parentNode.element.id);

      parentNode.replaceChildElement(
        action.payload.oldId,
        getSimplifiedElement(newNode.element)
      );
      parentNode.removeChild(action.payload.oldId);
      parentNode.addChild(newNode.element.id);
    },
    addElementInList: (
      state: Draft<State>,
      action: PayloadAction<{
        oldId: Id;
        ids: Id[];
      }>
    ) => {
      const oldNode = state[action.payload.oldId];
      if (
        oldNode?.parent === undefined ||
        state[oldNode?.parent] === undefined
      ) {
        return;
      }

      const parentNode = state[oldNode?.parent];
      const newNodes = action.payload.ids.map((id) => state[id]);

      parentNode.addChildElementInList(
        action.payload.oldId,
        newNodes.map((newNode) => getSimplifiedElement(newNode.element))
      );

      for (const newNode of newNodes) {
        parentNode.addChild(newNode.element.id);
        newNode.setParent(parentNode.element.id);
      }
    },
    updateElementInList: (
      state: Draft<State>,
      action: PayloadAction<{
        oldId: Id;
        ids: Id[];
      }>
    ) => {
      const oldNode = state[action.payload.oldId];

      if (
        oldNode?.parent === undefined ||
        state[oldNode?.parent] === undefined
      ) {
        return;
      }

      const parentNode = state[oldNode?.parent];
      const newNodes = action.payload.ids.map((id) => state[id]);

      if (oldNode.parent === parentNode.element.id) {
        oldNode.setParent(undefined);
      }

      parentNode.replaceChildElementInList(
        action.payload.oldId,
        newNodes.map((newNode) => getSimplifiedElement(newNode.element))
      );

      parentNode.removeChild(action.payload.oldId);

      for (const newNode of newNodes) {
        parentNode.addChild(newNode.element.id);
        newNode.setParent(parentNode.element.id);
      }
    },
    deleteElementInList: (
      state: Draft<State>,
      action: PayloadAction<{ ids: Id[] }>
    ) => {
      for (const id of action.payload.ids) {
        const node = state[id];

        if (node === undefined) {
          continue;
        }

        deleteElement(state, id);

        if (node.parent === undefined || state[node.parent] === undefined) {
          continue;
        }

        const parent = state[node.parent];

        parent.deleteChildElementInList(id);
        parent.removeChild(id);
      }
    },
    updateStateElement: (
      state: Draft<State>,
      action: PayloadAction<{
        stateElementId?: string;
        patches: Patch[];
      }>
    ) => {
      const stateElementId = action.payload.stateElementId;

      if (stateElementId === undefined) {
        throw new Error("Cannot update element with undefined state id");
      }

      const element = state[stateElementId].element;

      if (!(element instanceof DataContainer)) {
        throw new Error("Can only update state of DataContainer");
      }

      applyPatches(element, action.payload.patches);
    },
  },
});

export var reducer = slice.reducer;

export var actions = {
  callEndpoint: createAsyncThunk<
    State,
    Method,
    { dispatch: ThunkDispatch<RootState, unknown, AnyAction>; state: RootState }
  >("CALL_ENDPOINT", async (method: Method, thunkAPI) => {
    await engineDispatch(thunkAPI.dispatch, [method]);

    return selectors.getState(thunkAPI.getState());
  }),
  ...slice.actions,
};
