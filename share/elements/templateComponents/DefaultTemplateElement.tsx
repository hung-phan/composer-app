import { getElementClassName } from "../elementHelpers";
import { EngineComponentProps } from "../registry";
import renderElementInterface from "../renderElementInterface";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import { DefaultTemplate } from "./templates";

export default function DefaultTemplateElement(props: EngineComponentProps) {
  const element = useElementData(props.elementId, DefaultTemplate);

  useElementEvent(element);

  return (
    <div className={getElementClassName(element)}>
      {element.widgets.map((widget) => renderElementInterface(widget, element))}
    </div>
  );
}
