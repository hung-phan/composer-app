import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import _ from "lodash";

import { EngineComponentProps } from "../registry";
import renderElementInterface from "../renderElementInterface";
import useElementData from "../useElementData";
import useElementEvent from "../useElementEvent";
import useElementState from "../useElementState";
import { Modal, ModalState } from "./widgets";

export default function ModalComponent(props: EngineComponentProps) {
  const element = useElementData(props.elementId, Modal);

  useElementEvent(element);

  const elementState = useElementState<ModalState>(element);

  if (!elementState.show) {
    return null;
  }

  return (
    <Dialog
      key={element.id}
      open={elementState.show}
      size={elementState.size}
      handler={_.noop}
    >
      <DialogHeader>
        {element.headerItem &&
          renderElementInterface(element.headerItem, element)}
      </DialogHeader>

      {element.bodyItem && (
        <DialogBody>
          {renderElementInterface(element.bodyItem, element)}
        </DialogBody>
      )}

      {element.footerItem && (
        <DialogFooter>
          {renderElementInterface(element.footerItem, element)}
        </DialogFooter>
      )}
    </Dialog>
  );
}
