import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { engineDispatch } from "../../domain/engine";
import { EngineComponentProps } from "../registry";
import renderElementInterface from "../renderElementInterface";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import { PeriodicTemplate } from "./templates";

export default function PeriodicTemplateElement(props: EngineComponentProps) {
  const element = useElementData(props.elementId, PeriodicTemplate);

  useElementEvent(element);

  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(
      () => engineDispatch(dispatch, element.methods),
      element.intervalInMs
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {element.widgets.map((widget) => renderElementInterface(widget, element))}
    </>
  );
}
