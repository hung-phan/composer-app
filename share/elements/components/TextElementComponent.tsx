import { TextElement } from "../../domain/interfaces";
import { FuzzyComponentProps } from "../elementRegistry";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";

export default function TextElementComponent(props: FuzzyComponentProps) {
  const element = useElementData(props.elementId, TextElement);

  useElementEvent(element);

  return <span key={element.id}>{element.message}</span>;
}
