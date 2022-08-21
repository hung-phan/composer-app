import { Placeholder } from "../../domain/interfaces";
import { EngineComponentProps } from "../registry";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";

export default function PlaceholderComponent(props: EngineComponentProps) {
  const element = useElementData(props.elementId, Placeholder);

  useElementEvent(element);

  return null;
}
