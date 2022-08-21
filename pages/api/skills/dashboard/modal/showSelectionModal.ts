import { NextApiRequest, NextApiResponse } from "next";
import {
  DEFAULT_MODAL_CONFIG,
  ModalConfig,
} from "server/application/modal/config";
import { WidgetType } from "server/domain/widgets/types";
import { encode } from "share/domain/engine/serializers";
import {
  BatchRenderElementMethod,
  HttpMethod,
  HttpMethodBuilder,
  Method,
  Response,
} from "share/domain/interfaces";
import { Button, Layout } from "share/elements/components/widgets";

import {
  ShowAndHideModalInvoke,
  ShowAndHideModalPrepareInvoke,
} from "../../modal/showAndHideModal";
import { ShowInputModalPrepareInvoke } from "./showInputModal";

export function ShowSelectionModalInvoke(): Method[] {
  return [
    ...ShowAndHideModalInvoke({
      modalConfig: DEFAULT_MODAL_CONFIG,
      show: true,
    }),
    BatchRenderElementMethod.builder()
      .elements([
        Layout.builder()
          .id(DEFAULT_MODAL_CONFIG.bodyPlaceholder)
          .items([
            Button.builder()
              .label("Website")
              .onSelected(ShowInputModalPrepareInvoke(WidgetType.IFRAME_WIDGET))
              .build(),
            Button.builder()
              .label("Editor")
              .onSelected(ShowInputModalPrepareInvoke(WidgetType.EDITOR_WIDGET))
              .build(),
          ])
          .build(),
        Layout.builder()
          .id(DEFAULT_MODAL_CONFIG.footerPlaceholder)
          .items([
            Button.builder()
              .variant("text")
              .color("red")
              .label("Cancel")
              .onSelected(
                ShowAndHideModalPrepareInvoke({
                  modalConfig: DEFAULT_MODAL_CONFIG,
                  show: false,
                })
              )
              .build(),
          ])
          .build(),
      ])
      .build(),
  ];
}

export function ShowSelectionModalPrepareInvoke(): Method[] {
  return [
    (HttpMethod.builder() as HttpMethodBuilder<ModalConfig>)
      .url("/api/skills/dashboard/modal/showSelectionModal")
      .requestType("POST")
      .build(),
  ];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      res
        .status(200)
        .send(
          encode(Response.builder().methods(ShowSelectionModalInvoke()).build())
        );

      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
