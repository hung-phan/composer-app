import { StateHolderElement } from "../../domain/interfaces";
import { FuzzyComponentProps } from "../elementRegistry";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";

export default function StateHolderElementComponent(
  props: FuzzyComponentProps
) {
  const element = useElementData(props.elementId, StateHolderElement);

  useElementEvent(element);

  return null;
}
