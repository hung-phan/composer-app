import { Fragment } from "react";

import { EngineComponentProps } from "../registry";
import renderElementInterface from "../renderElementInterface";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import { FragmentLayout } from "./widgets";

export default function FragmentLayoutComponent(props: EngineComponentProps) {
  const element = useElementData(props.elementId, FragmentLayout);

  useElementEvent(element);

  return (
    <Fragment key={element.id}>
      {element.items.map((widget) => renderElementInterface(widget, element))}
    </Fragment>
  );
}
