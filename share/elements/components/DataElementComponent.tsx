import { DataElement } from "../../domain/interfaces";
import { FuzzyComponentProps } from "../elementRegistry";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";

export default function DataElementComponent(props: FuzzyComponentProps) {
  const element = useElementData(props.elementId, DataElement);

  useElementEvent(element);

  return (
    <span key={element.id} className={element.class}>
      {element.data}
    </span>
  );
}
