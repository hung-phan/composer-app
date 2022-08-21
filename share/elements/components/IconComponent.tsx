import { getElementClassName } from "../elementHelpers";
import { EngineComponentProps } from "../registry";
import { getIconComponent } from "../registry/iconRegistry";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import { Icon } from "./widgets";

export default function IconComponent(props: EngineComponentProps) {
  const element = useElementData(props.elementId, Icon);

  useElementEvent(element);

  const Component = getIconComponent(element.icon);

  return (
    <Component key={element.id} className={getElementClassName(element)} />
  );
}
