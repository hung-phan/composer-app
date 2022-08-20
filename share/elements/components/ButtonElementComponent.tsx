import { useDispatch } from "react-redux";

import { engineDispatch } from "../../domain/engine";
import { ButtonElement } from "../../domain/interfaces";
import { FuzzyComponentProps } from "../elementRegistry";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";

export default function ButtonElementComponent(props: FuzzyComponentProps) {
  const element = useElementData(props.elementId, ButtonElement);

  useElementEvent(element);

  const dispatch = useDispatch();

  return (
    <button
      key={element.id}
      onClick={() => engineDispatch(dispatch, element.onSelected)}
    >
      {element.label && <span>{element.label}</span>}
    </button>
  );
}
