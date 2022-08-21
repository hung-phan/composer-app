import { IconButton as MaterialIconButton } from "@material-tailwind/react";
import { useDispatch } from "react-redux";

import { extractClientInfoFromProps } from "../../domain/common";
import { engineDispatch } from "../../domain/engine";
import { getElementClassName } from "../elementHelpers";
import { EngineComponentWithParentProps } from "../registry";
import renderElementInterface from "../renderElementInterface";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import { IconButton } from "./widgets";

export default function IconButtonComponent(
  props: EngineComponentWithParentProps<any>
) {
  const element = useElementData(props.elementId, IconButton);

  useElementEvent(element);

  const dispatch = useDispatch();

  return (
    <MaterialIconButton
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
      {renderElementInterface(element.icon, element)}
    </MaterialIconButton>
  );
}
