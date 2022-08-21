import { Input as MaterialInput } from "@material-tailwind/react";
import { produceWithPatches } from "immer";
import { useDispatch } from "react-redux";

import { actions, engineDispatch } from "../../domain/engine";
import { EngineComponentProps } from "../registry";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import useElementState from "../useElementState";
import { Input, InputState } from "./widgets";

export default function InputComponent(props: EngineComponentProps) {
  const element = useElementData(props.elementId, Input);

  useElementEvent(element);

  const elementState = useElementState<InputState>(element);
  const dispatch = useDispatch();
  const sendInputOnChange = (currentValue: string) => {
    const [, patches] = produceWithPatches(elementState, (draft) => {
      draft.value = currentValue;
    });

    dispatch(
      actions.updateStateElement({
        stateElementId: element.stateId,
        patches,
      })
    );

    engineDispatch(dispatch, element.onInputChange);
  };
  const sendInputOnEnterKeyPress = (currentValue: string) => {
    const [, patches] = produceWithPatches(elementState, (draft) => {
      draft.value = currentValue;
    });

    dispatch(
      actions.updateStateElement({
        stateElementId: element.stateId,
        patches,
      })
    );

    engineDispatch(dispatch, element.onEnterKeyPressed);
  };

  return (
    <MaterialInput
      key={element.id}
      value={elementState.value}
      name={element.name}
      label={element.label}
      onChange={(event) => {
        sendInputOnChange(event.target.value);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          sendInputOnEnterKeyPress(elementState.value);
        }
      }}
    />
  );
}
