import { Button as MaterialButton } from "@material-tailwind/react";
import { useDispatch } from "react-redux";

import { extractClientInfoFromProps } from "../../domain/common";
import { engineDispatch } from "../../domain/engine";
import { getElementClassName } from "../elementHelpers";
import { EngineComponentWithParentProps } from "../registry";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import { Button } from "./widgets";

export default function ButtonComponent(
  props: EngineComponentWithParentProps<any>
) {
  const element = useElementData(props.elementId, Button);

  useElementEvent(element);

  const dispatch = useDispatch();

  return (
    <MaterialButton
      key={element.id}
      type={element.type}
      variant={element.variant}
      size={element.size}
      color={element.color}
      onClick={() =>
        engineDispatch(
          dispatch,
          element.onSelected,
          extractClientInfoFromProps(props.parentProps)
        )
      }
      className={getElementClassName(element)}
    >
      {element.label !== undefined && element.label}
    </MaterialButton>
  );
}
