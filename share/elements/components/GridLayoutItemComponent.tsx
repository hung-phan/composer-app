import { Card, CardBody } from "@material-tailwind/react";

import { EngineComponentWithParentProps } from "../registry";
import renderElementInterface from "../renderElementInterface";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import { GridLayoutItem } from "./widgets";

export default function GridLayoutItemComponent(
  props: EngineComponentWithParentProps<any>
) {
  const element = useElementData(props.elementId, GridLayoutItem);

  useElementEvent(element);

  if (!element.item) {
    return null;
  }

  return (
    <Card key={element.id} className="flex w-full h-full">
      {element.actionButtons !== undefined && (
        <div className="flex justify-end p-1 bg-[#e3f2fd] bg-clip-border rounded-tl-xl rounded-tr-xl cursor-move draggable-handle">
          {element.actionButtons.map((button) =>
            renderElementInterface(button, element, props.parentProps)
          )}
        </div>
      )}

      <CardBody className="flex-1 overflow-auto">
        {renderElementInterface(element.item, element)}
      </CardBody>
    </Card>
  );
}
