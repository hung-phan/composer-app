import produce from "immer";
import { HYDRATE, MakeStore, createWrapper } from "next-redux-wrapper";
import { DefaultRootState } from "react-redux";
import {
  AnyAction,
  Store,
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
} from "redux";
import thunkMiddleware, { ThunkMiddleware } from "redux-thunk";

import {
  State as TemplateEngineState,
  selectors,
  mountPoint as templateEngineMountPoint,
  reducer as templateEngineReducer,
} from "./domain/engine/coreEngineStateStore";
import { convertToClass, encode } from "./domain/engine/serializers";
import { Element } from "./domain/interfaces";

export const middlewares = [
  thunkMiddleware as ThunkMiddleware<DefaultRootState, AnyAction>,
];

export const enhancers = [];

if (
  process.env.ENVIRONMENT === "client" &&
  process.env.NODE_ENV === "development"
) {
  if ((window as any).__REDUX_DEVTOOLS_EXTENSION__) {
    enhancers.push((window as any).__REDUX_DEVTOOLS_EXTENSION__());
  }
}

export interface RootState {
  [templateEngineMountPoint]: TemplateEngineState;
}

const applicationReducer = combineReducers({
  [templateEngineMountPoint]: templateEngineReducer,
});

export const makeStore: MakeStore<Store<RootState>> = () =>
  createStore(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (state: RootState, action: AnyAction) =>
      produce(state, (draft) => {
        switch (action.type) {
          case HYDRATE:
            Object.assign(draft, action.payload);
            break;

          default:
            return applicationReducer(draft, action);
        }
      }),
    { [templateEngineMountPoint]: {} }, // preloadedState
    compose(applyMiddleware(...middlewares), ...enhancers)
  );

export const wrapper = createWrapper<Store<RootState>>(makeStore, {
  serializeState: encode,
  deserializeState: (encodedData: string) => {
    const state = JSON.parse(encodedData);

    const templateEngineState = selectors.getState(state);

    for (const [key, value] of Object.entries(templateEngineState)) {
      templateEngineState[key].element = convertToClass<Element>(value.element);
    }

    return state;
  },
});
