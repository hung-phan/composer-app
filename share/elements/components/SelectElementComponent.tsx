import { produceWithPatches } from "immer";
import _ from "lodash";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { actions, engineDispatch } from "../../domain/engine";
import { SelectElement, SelectElementState } from "../../domain/interfaces";
import { FuzzyComponentProps } from "../elementRegistry";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import useElementState from "../useElementState";

export default function SelectElementComponent(props: FuzzyComponentProps) {
  const element = useElementData(props.elementId, SelectElement);

  useElementEvent(element);

  const elementState = useElementState<SelectElementState>(element);
  const dispatch = useDispatch();
  const [value, setValue] = useState(element.defaultValue);
  const handleItemSelect = useCallback(
    (itemValue: string) => {
      if (itemValue === value) {
        return;
      }

      const [, patches] = produceWithPatches(elementState, (draft) => {
        draft.data = itemValue;
      });

      dispatch(
        actions.updateStateElement({
          stateElementId: element.stateId,
          patches,
        })
      );

      if (element.onItemSelected) {
        engineDispatch(dispatch, element.onItemSelected);
      }

      setValue(itemValue);
    },
    [setValue]
  );

  return (
    <div
      key={element.id}
      className={`flex justify-center items-center ${
        element.class || ""
      }`.trim()}
    >
      <select value={value} onChange={(e) => handleItemSelect(e.toString())}>
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
