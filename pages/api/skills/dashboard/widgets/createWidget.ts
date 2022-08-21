import { NextApiRequest, NextApiResponse } from "next";
import { WIDGET_LAYOUT_PLACEHOLDER_ID } from "server/application/dashboard/config";
import {
  extractWidgetData,
  getWidgetActionButtons,
} from "server/application/dashboard/widgets/helpers";
import { DEFAULT_MODAL_CONFIG } from "server/application/modal/config";
import { WidgetType } from "server/domain/widgets/types";
import { encode } from "share/domain/engine/serializers";
import {
  AddInListElementMethod,
  DataContainer,
  HttpMethod,
  HttpMethodBuilder,
  HttpMethodRequestBody,
  Method,
  Response,
} from "share/domain/interfaces";
import { GridLayoutItem } from "share/elements/components/widgets";

import { ShowAndHideModalInvoke } from "../../modal/showAndHideModal";
import { AddWidgetToDashboardInvoke } from "../addWidgetToDashboard";

export function CreateWidgetInvoke(
  widgetType: WidgetType,
  dataContainers?: DataContainer[]
): Method[] {
  const { widget, element } = extractWidgetData({ widgetType, dataContainers });

  return [
    AddInListElementMethod.builder()
      .id(WIDGET_LAYOUT_PLACEHOLDER_ID)
      .elements([
        GridLayoutItem.builder()
          .id(widget.id)
          .item(element)
          .actionButtons(getWidgetActionButtons(widget))
          .build(),
      ])
      .build(),
    ...AddWidgetToDashboardInvoke(widget),
    ...ShowAndHideModalInvoke({
      modalConfig: DEFAULT_MODAL_CONFIG,
      show: false,
    }),
  ];
}

export function CreateWidgetPrepareInvoke(
  widgetType: WidgetType,
  dataContainers: DataContainer[] = []
): Method[] {
  return [
    (HttpMethod.builder() as HttpMethodBuilder<WidgetType>)
      .url("/api/skills/dashboard/widgets/createWidget")
      .requestType("POST")
      .stateIds(dataContainers.map((dataContainer) => dataContainer.id))
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
      const {
        requestData,
        elementStates,
      }: HttpMethodRequestBody<WidgetType, any> = req.body;

      if (requestData === undefined) {
        res.status(400).end("Missing requestData");
        return;
      }

      res
        .status(200)
        .send(
          encode(
            Response.builder()
              .methods(CreateWidgetInvoke(requestData.data, elementStates))
              .build()
          )
        );

      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
