import { NextApiRequest, NextApiResponse } from "next";
import { renderWidgetInputModal } from "server/application/dashboard/widgets/helpers";
import { DEFAULT_MODAL_CONFIG } from "server/application/modal/config";
import { WidgetType } from "server/domain/widgets/types";
import { encode } from "share/domain/engine/serializers";
import {
  HttpMethod,
  HttpMethodBuilder,
  HttpMethodRequestBody,
  Method,
  Response,
} from "share/domain/interfaces";

import { ShowAndHideModalInvoke } from "../../modal/showAndHideModal";

export function ShowInputModalInvoke(widgetType: WidgetType): Method[] {
  return [
    ...renderWidgetInputModal({ widgetType }),
    ...ShowAndHideModalInvoke({
      modalConfig: DEFAULT_MODAL_CONFIG,
      show: true,
    }),
  ];
}

export function ShowInputModalPrepareInvoke(widgetType: WidgetType): Method[] {
  return [
    (HttpMethod.builder() as HttpMethodBuilder<WidgetType>)
      .url("/api/skills/dashboard/modal/showInputModal")
      .requestType("POST")
      .requestData({ data: widgetType })
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
      const { requestData }: HttpMethodRequestBody<WidgetType, any> = req.body;

      if (requestData === undefined) {
        res.status(400).end('Missing requestData');
        return;
      }

      res
        .status(200)
        .send(
          encode(
            Response.builder()
              .methods(ShowInputModalInvoke(requestData.data))
              .build()
          )
        );

      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
