import { NextApiRequest, NextApiResponse } from "next";
import { WIDGET_LAYOUT_STATE_ID } from "server/application/dashboard/config";
import { IndexInCollection } from "share/domain/common";
import { encode } from "share/domain/engine/serializers";
import {
  DeleteInListElementMethod,
  HttpMethod,
  HttpMethodBuilder,
  HttpMethodRequestBody,
  Method,
  Response,
  UpdateStateMethod,
} from "share/domain/interfaces";
import { Widget } from "share/domain/widgets";
import { Id } from "share/library/idGenerator";

export function DeleteWidgetFromDashboardInvoke(
  widgetId: Id,
  widgetIndex: number
): Method[] {
  return [
    UpdateStateMethod.builder()
      .stateElementId(WIDGET_LAYOUT_STATE_ID)
      .patches([
        {
          op: "remove",
          path: ["widgets", widgetIndex],
        },
      ])
      .build(),
    DeleteInListElementMethod.builder().ids([widgetId]).build(),
  ];
}

export function DeleteWidgetFromDashboardPrepareInvoke(
  widget: Widget
): Method[] {
  return [
    (HttpMethod.builder() as HttpMethodBuilder<Id>)
      .url("/api/skills/dashboard/deleteWidgetFromDashboard")
      .requestType("POST")
      .requestData({
        data: widget.id,
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
      }: HttpMethodRequestBody<Id, IndexInCollection> = req.body;

      if (requestData === undefined) {
        res.status(400).end('Missing requestData');
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
                DeleteWidgetFromDashboardInvoke(
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
