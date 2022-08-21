import { NextApiRequest, NextApiResponse } from "next";
import { renderWidgetInputModal } from "server/application/dashboard/widgets/helpers";
import { DEFAULT_MODAL_CONFIG } from "server/application/modal/config";
import { WidgetType } from "server/domain/widgets/types";
import { IndexInCollection } from "share/domain/common";
import { encode } from "share/domain/engine/serializers";
import {
  HttpMethod,
  HttpMethodBuilder,
  HttpMethodRequestBody,
  Method,
  Response,
} from "share/domain/interfaces";
import { Widget } from "share/domain/widgets";

import { ShowAndHideModalInvoke } from "../../modal/showAndHideModal";

export function UpdateInputModalInvoke(
  widget: Widget,
  widgetIndex: number
): Method[] {
  return [
    ...renderWidgetInputModal({
      widgetType: WidgetType[widget.type],
      currentWidget: widget,
      widgetIndex,
    }),
    ...ShowAndHideModalInvoke({
      modalConfig: DEFAULT_MODAL_CONFIG,
      show: true,
    }),
  ];
}

export function UpdateInputModalPrepareInvoke(widget: Widget): Method[] {
  return [
    (HttpMethod.builder() as HttpMethodBuilder<Widget>)
      .url("/api/skills/dashboard/modal/updateInputModal")
      .requestType("POST")
      .requestData({
        data: widget,
      })
      .build(),
  ];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "POST":
      const {
        requestData,
        clientInfo,
      }: HttpMethodRequestBody<Widget, IndexInCollection> = req.body;

      if (requestData === undefined) {
        res.status(400).end("Missing requestData");
        return;
      }

      if (clientInfo === undefined) {
        res.status(400).end("Missing clientInfo");
        return;
      }

      res
        .status(200)
        .send(
          encode(
            Response.builder()
              .methods(
                UpdateInputModalInvoke(
                  requestData.data,
                  clientInfo.data.indexInCollection
                )
              )
              .build()
          )
        );

      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
