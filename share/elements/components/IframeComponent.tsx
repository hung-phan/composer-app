import { getElementClassName } from "../elementHelpers";
import { EngineComponentProps } from "../registry";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import { Iframe } from "./widgets";

export default function IframeComponent(props: EngineComponentProps) {
  const element = useElementData(props.elementId, Iframe);

  useElementEvent(element);

  return (
    <iframe
      key={element.id}
      className={getElementClassName(element, "w-full h-full")}
      src={element.url}
      sandbox="allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
    ></iframe>
  );
}
