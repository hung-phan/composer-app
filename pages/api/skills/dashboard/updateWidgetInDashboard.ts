import { NextApiRequest, NextApiResponse } from "next";
import { WIDGET_LAYOUT_STATE_ID } from "server/application/dashboard/config";
import { encode } from "share/domain/engine/serializers";
import {
  HttpMethod,
  HttpMethodBuilder,
  HttpMethodRequestBody,
  Method,
  Response,
  UpdateStateMethod,
} from "share/domain/interfaces";
import { Widget } from "share/domain/widgets";

export function UpdateWidgetInDashboardInvoke(
  widget: Widget,
  widgetIndex: number
): Method[] {
  return [
    UpdateStateMethod.builder()
      .stateElementId(WIDGET_LAYOUT_STATE_ID)
      .patches([
        {
          op: "replace",
          path: ["widgets", widgetIndex],
          value: widget,
        },
      ])
      .build(),
  ];
}

interface RequestData {
  widget: Widget;
  widgetIndex: number;
}

export function UpdateWidgetInDashboardPrepareInvoke(
  widget: Widget,
  widgetIndex: number
): Method[] {
  return [
    (HttpMethod.builder() as HttpMethodBuilder<RequestData>)
      .url("/api/skills/dashboard/updateWidgetInDashboard")
      .requestType("POST")
      .requestData({ data: { widget, widgetIndex } })
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
      const { requestData }: HttpMethodRequestBody<RequestData, any> = req.body;

      if (requestData === undefined) {
        res.status(400).end('Missing requestData');
        return;
      }

      res
        .status(200)
        .send(
          encode(
            Response.builder()
              .methods(
                UpdateWidgetInDashboardInvoke(
                  requestData.data.widget,
                  requestData.data.widgetIndex
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
