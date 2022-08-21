import { EngineComponentProps } from "../registry";
import renderElementInterface from "../renderElementInterface";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import { FormField } from "./widgets";

export default function FormFieldComponent(props: EngineComponentProps) {
  const element = useElementData(props.elementId, FormField);

  useElementEvent(element);

  return (
    <>
      {element.fieldName && <label>{element.fieldName}</label>}
      {renderElementInterface(element.fieldElement, element)}
    </>
  );
}
