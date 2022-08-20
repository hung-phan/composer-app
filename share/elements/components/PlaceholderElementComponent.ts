import { PlaceholderElement } from "../../domain/interfaces";
import { FuzzyComponentProps } from "../elementRegistry";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";

export default function PlaceholderElementComponent(
  props: FuzzyComponentProps
) {
  const element = useElementData(props.elementId, PlaceholderElement);

  useElementEvent(element);

  return null;
}
