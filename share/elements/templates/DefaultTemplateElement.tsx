import { DefaultTemplate } from "../../domain/interfaces";
import { FuzzyComponentProps } from "../elementRegistry";
import renderElementInterface from "../renderElementInterface";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";

export default function DefaultTemplateElement(props: FuzzyComponentProps) {
  const element = useElementData(props.elementId, DefaultTemplate);

  useElementEvent(element);

  return (
    <div className="flex flex-col gap-6 w-full min-h-screen items-center">
      {element.widgets.map((widget) => renderElementInterface(widget, element))}
    </div>
  );
}
