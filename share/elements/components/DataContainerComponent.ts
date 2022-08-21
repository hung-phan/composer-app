import { DataContainer } from "../../domain/interfaces";
import { EngineComponentProps } from "../registry";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";

export default function DataContainerComponent(props: EngineComponentProps) {
  const element = useElementData(props.elementId, DataContainer);

  useElementEvent(element);

  return null;
}
