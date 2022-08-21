import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { engineDispatch } from "../domain/engine";
import { Element } from "../domain/interfaces";
import useEffectOnce from "./useEffectOnce";

export default function useElementEvent(element?: Element): void {
  const dispatch = useDispatch();

  function lifeCycleFunc() {
    if (element) {
      engineDispatch(dispatch, element.onCreate);
    }

    return () => {
      if (element) {
        engineDispatch(dispatch, element.onDestroy);
      }
    };
    // DO NOT modify deps array, it is there to prevent update
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }

  if (process.env.NODE_ENV === "development") {
    useEffectOnce(lifeCycleFunc);
  } else {
    useEffect(lifeCycleFunc, []);
  }
}
