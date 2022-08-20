import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { actions, engineDispatch } from "../domain/engine";
import { Element } from "../domain/interfaces";

export default function useElementEvent(element: Element): void {
  const dispatch = useDispatch();

  useEffect(() => {
    if (element && element.onCreate) {
      engineDispatch(dispatch, element.onCreate);
    }

    return () => {
      if (element) {
        if (element.onDestroy) {
          engineDispatch(dispatch, element.onDestroy);
        }

        dispatch(
          actions.delElement({
            id: element.id,
            interfaceName: element.interfaceName,
          })
        );
      }
    };
    // DO NOT modify deps array, it is there to prevent update
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
