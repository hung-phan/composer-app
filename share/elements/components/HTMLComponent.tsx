import { getElementClassName } from "../elementHelpers";
import { EngineComponentProps } from "../registry";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import { HTML } from "./widgets";

export default function HTMLComponent(props: EngineComponentProps) {
  const element = useElementData(props.elementId, HTML);

  useElementEvent(element);

  return (
    <div
      key={element.id}
      className={getElementClassName(element)}
      dangerouslySetInnerHTML={{ __html: element.html }}
    />
  );
}
