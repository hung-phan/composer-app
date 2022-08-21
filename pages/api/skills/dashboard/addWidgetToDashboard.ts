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

export function AddWidgetToDashboardInvoke(widget: Widget): Method[] {
  return [
    UpdateStateMethod.builder()
      .stateElementId(WIDGET_LAYOUT_STATE_ID)
      .patches([
        {
          op: "add",
          path: ["widgets", "-"],
          value: widget,
        },
        {
          op: "add",
          path: ["layouts", "lg", "-"],
          value: {
            i: widget.id,
            w: 2,
            h: 2,
            x: 0,
            y: 0,
            static: false,
            moved: false,
          },
        },
      ])
      .build(),
  ];
}

export function AddWidgetToDashboardPrepareInvoke(widget: Widget): Method[] {
  return [
    (HttpMethod.builder() as HttpMethodBuilder<Widget>)
      .url("/api/skills/dashboard/addWidgetToDashboard")
      .requestType("POST")
      .requestData({ data: widget })
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
      const { requestData }: HttpMethodRequestBody<Widget, any> = req.body;

      if (requestData === undefined) {
        res.status(400).end('Missing requestData');
        return;
      }

      res
        .status(200)
        .send(
          encode(
            Response.builder()
              .methods(AddWidgetToDashboardInvoke(requestData.data))
              .build()
          )
        );

      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
