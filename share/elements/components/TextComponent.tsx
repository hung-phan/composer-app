import { Typography } from "@material-tailwind/react";

import { getElementClassName } from "../elementHelpers";
import { EngineComponentProps } from "../registry";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import { Text } from "./widgets";

export default function TextComponent(props: EngineComponentProps) {
  const element = useElementData(props.elementId, Text);

  useElementEvent(element);

  return (
    <Typography
      key={element.id}
      variant={element.variant}
      color={element.color}
      className={getElementClassName(element)}
    >
      {element.message}
    </Typography>
  );
}
