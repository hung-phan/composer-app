import { Element } from "../../domain/interfaces";
import { EngineComponentProps } from "../registry";
import renderElementInterface from "../renderElementInterface";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import { Clone } from "./widgets";

export default function CloneComponent(props: EngineComponentProps) {
  const element = useElementData(props.elementId, Clone);

  useElementEvent(element);

  const cloneElement = useElementData(element.cloneElementId, Element);

  if (!cloneElement) {
    return null;
  }

  return renderElementInterface(cloneElement, element);
}
