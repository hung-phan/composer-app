import { ROOT_ID } from "../domain/engine";
import { Element } from "../domain/interfaces";
import renderElementInterface from "./renderElementInterface";
import useElementData from "./useElementData";
import useElementEvent from "./useElementEvent";

export default function RootElement() {
  const element = useElementData(ROOT_ID, Element);

  useElementEvent(element);

  return renderElementInterface(element);
}
