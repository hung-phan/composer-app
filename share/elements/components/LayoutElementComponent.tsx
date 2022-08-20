import { LayoutElement } from "../../domain/interfaces";
import { FuzzyComponentProps } from "../elementRegistry";
import renderElementInterface from "../renderElementInterface";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";

export default function LayoutElementComponent(props: FuzzyComponentProps) {
  const element = useElementData(props.elementId, LayoutElement);

  useElementEvent(element);

  return (
    <div key={element.id}>
      {element.elements.map((widget) =>
        renderElementInterface(widget, element)
      )}
    </div>
  );
}
