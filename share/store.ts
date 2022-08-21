import { Middleware, configureStore } from "@reduxjs/toolkit";
import { produce } from "immer";
import { HYDRATE, MakeStore, createWrapper } from "next-redux-wrapper";
import { AnyAction, Store, StoreEnhancer, combineReducers } from "redux";

import {
  selectors,
  mountPoint as templateEngineMountPoint,
  reducer as templateEngineReducer,
} from "./domain/engine/coreEngineStateStore";
import { convertToClass, encode } from "./domain/engine/serializers";
import { Node } from "./domain/interfaces";

export const middlewares: Middleware[] = [];
export const enhancers: StoreEnhancer[] = [];

const applicationReducer = combineReducers({
  [templateEngineMountPoint]: templateEngineReducer,
});

export type RootState = ReturnType<typeof applicationReducer>;

export const makeStore: MakeStore<Store<RootState>> = () =>
  configureStore({
    reducer: (state: RootState, action: AnyAction) =>
      produce(state, (draft) => {
        switch (action.type) {
          case HYDRATE:
            Object.assign(draft, action.payload);
            break;

          default:
            return applicationReducer(draft, action);
        }
      }),
    devTools:
      process.env.ENVIRONMENT === "client" &&
      process.env.NODE_ENV === "development",
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }).concat(...middlewares),
    enhancers,
  });

export const wrapper = createWrapper<Store<RootState>>(makeStore, {
  serializeState: encode,
  deserializeState: (encodedData: string) => {
    const state = JSON.parse(encodedData);

    const templateEngineState = selectors.getState(state);

    for (const [key, value] of Object.entries(templateEngineState)) {
      templateEngineState[key] = convertToClass<Node>(value);
    }

    return state;
  },
});
