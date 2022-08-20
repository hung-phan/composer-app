import { ImageElement } from "../../domain/interfaces";
import { FuzzyComponentProps } from "../elementRegistry";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";

export default function ImageElementComponent(props: FuzzyComponentProps) {
  const element = useElementData(props.elementId, ImageElement);

  useElementEvent(element);

  return (
    <img
      key={element.id}
      src={element.src}
      alt={element.alt}
      className={element.class}
    />
  );
}
