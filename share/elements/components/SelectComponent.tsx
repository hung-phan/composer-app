import { produceWithPatches } from "immer";
import _ from "lodash";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { actions, engineDispatch } from "../../domain/engine";
import { EngineComponentProps } from "../registry";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import useElementState from "../useElementState";
import { Select, SelectState } from "./widgets";

export default function SelectComponent(props: EngineComponentProps) {
  const element = useElementData(props.elementId, Select);

  useElementEvent(element);

  const elementState = useElementState<SelectState>(element);
  const dispatch = useDispatch();
  const handleItemSelect = useCallback(
    (itemValue: string) => {
      if (itemValue === elementState.value) {
        return;
      }

      const [, patches] = produceWithPatches(elementState, (draft) => {
        draft.value = itemValue;
      });

      dispatch(
        actions.updateStateElement({
          stateElementId: element.stateId,
          patches,
        })
      );

      engineDispatch(dispatch, element.onItemSelected);
    },
    [elementState.value]
  );

  return (
    <div
      key={element.id}
      className={`flex justify-center items-center ${
        element.class || ""
      }`.trim()}
    >
      <select
        value={elementState.value}
        onChange={(e) => handleItemSelect(e.toString())}
      >
        {_.zip(element.itemValues, element.itemDescriptions).map(
          ([itemValue, itemDescription], index) => (
            <option key={index} value={itemValue}>
              {itemDescription}
            </option>
          )
        )}
      </select>
    </div>
  );
}
