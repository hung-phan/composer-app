import _ from "lodash";

import { EngineComponentProps } from "../registry";
import renderElementInterface from "../renderElementInterface";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import { Form } from "./widgets";

export default function FormComponent(props: EngineComponentProps) {
  const element = useElementData(props.elementId, Form);

  useElementEvent(element);

  if (_.isEmpty(element.fields)) {
    return null;
  }

  return (
    <form id={element.formId} action={element.action} method={element.method}>
      {element.fields.map((field) => renderElementInterface(field, element))}
      {element.submitButton &&
        renderElementInterface(element.submitButton, element)}
    </form>
  );
}
