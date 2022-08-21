import { getElementClassName } from "../elementHelpers";
import { EngineComponentProps } from "../registry";
import renderElementInterface from "../renderElementInterface";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import { Layout } from "./widgets";

export default function LayoutComponent(props: EngineComponentProps) {
  const element = useElementData(props.elementId, Layout);

  useElementEvent(element);

  const elementClass = getElementClassName(
    element,
    `flex ${element.direction === "horizontal" ? "flex-row" : "flex-col"} gap-6`
  );

  return (
    <div key={element.id} className={elementClass}>
      {element.items.map((widget) => renderElementInterface(widget, element))}
    </div>
  );
}
