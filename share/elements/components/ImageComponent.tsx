import { EngineComponentProps } from "../registry";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import { Image } from "./widgets";

export default function ImageComponent(props: EngineComponentProps) {
  const element = useElementData(props.elementId, Image);

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
