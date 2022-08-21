import { GetServerSidePropsContext } from "next";
import { ParsedUrlQuery } from "querystring";
import { AnyAction, Store } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { actions } from "share/domain/engine";
import { HttpMethod } from "share/domain/interfaces";
import { RootState, wrapper } from "share/store";

type GetServerSidePropsType = (
  store: Store<RootState>,
  ctx: GetServerSidePropsContext<ParsedUrlQuery, string | false | object | undefined>
) => HttpMethod<any>;

export default function createServersidePropsForEndpoint(
  getServerSideProps: GetServerSidePropsType
) {
  return wrapper.getServerSideProps((store) => async (ctx) => {
    await (store.dispatch as ThunkDispatch<RootState, any, AnyAction>)(
      actions.callEndpoint(getServerSideProps(store, ctx))
    );

    return { props: {} };
  });
}
