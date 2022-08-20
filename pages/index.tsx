import { DefaultRootState } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { actions } from "../share/domain/engine";
import { HttpMethod } from "../share/domain/interfaces";
import RootElement from "../share/elements/RootElement";
import { wrapper } from "../share/store";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    await (store.dispatch as ThunkDispatch<DefaultRootState, any, AnyAction>)(
      actions.callEndpoint.action(
        HttpMethod.builder()
          .url("/api/skill/home/showHome")
          .requestType("GET")
          .build()
      )
    );

    return { props: {} };
  }
);

export default RootElement;
