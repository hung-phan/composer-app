import { produceWithPatches } from "immer";
import _ from "lodash";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { actions, engineDispatch } from "../../domain/engine";
import { InputElement, InputElementState } from "../../domain/interfaces";
import { FuzzyComponentProps } from "../elementRegistry";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import useElementState from "../useElementState";

export default function InputElementComponent(props: FuzzyComponentProps) {
  const element = useElementData(props.elementId, InputElement);

  useElementEvent(element);

  const elementState = useElementState<InputElementState>(element);
  const dispatch = useDispatch();
  const [value, setValue] = useState(element.defaultValue);
  const sendInputOnChange = useCallback(
    _.debounce((currentValue: string) => {
      const [, patches] = produceWithPatches(elementState, (draft) => {
        draft.data = currentValue;
      });

      dispatch(
        actions.updateStateElement({
          stateElementId: element.stateId,
          patches,
        })
      );

      if (element.onInputChange) {
        engineDispatch(dispatch, element.onInputChange);
      }

      setValue(currentValue);
    }, 300),
    [setValue]
  );
  const sendInputOnEnterKeyPress = useCallback(
    _.debounce((currentValue: string) => {
      const [, patches] = produceWithPatches(elementState, (draft) => {
        draft.data = currentValue;
      });

      dispatch(
        actions.updateStateElement({
          stateElementId: element.stateId,
          patches,
        })
      );

      if (element.onEnterKeyPressed) {
        engineDispatch(dispatch, element.onEnterKeyPressed);
      }

      setValue(currentValue);
    }, 300),
    [setValue]
  );

  return (
    <input
      key={element.id}
      value={value}
      placeholder={element.placeholder}
      onChange={(event) => {
        setValue(event.target.value);
        sendInputOnChange(event.target.value);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          sendInputOnEnterKeyPress(value);
        }
      }}
    />
  );
}
