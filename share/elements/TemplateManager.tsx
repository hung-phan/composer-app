import { ROOT_ID } from "../domain/engine";
import renderElementInterface from "./renderElementInterface";
import { Template } from "./templateComponents/templates";
import useElementData from "./useElementData";
import useElementEvent from "./useElementEvent";

export default function TemplateManager() {
  const element = useElementData(ROOT_ID, Template);

  useElementEvent(element);

  return renderElementInterface(element);
}
