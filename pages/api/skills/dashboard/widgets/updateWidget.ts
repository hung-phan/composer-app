import { NextApiRequest, NextApiResponse } from "next";
import {
  extractWidgetData,
  getWidgetActionButtons,
} from "server/application/dashboard/widgets/helpers";
import { DEFAULT_MODAL_CONFIG } from "server/application/modal/config";
import { WidgetType } from "server/domain/widgets/types";
import { encode } from "share/domain/engine/serializers";
import {
  DataContainer,
  HttpMethod,
  HttpMethodBuilder,
  HttpMethodRequestBody,
  Method,
  RenderElementMethod,
  Response,
} from "share/domain/interfaces";
import { Widget } from "share/domain/widgets";
import { GridLayoutItem } from "share/elements/components/widgets";

import { ShowAndHideModalInvoke } from "../../modal/showAndHideModal";
import { UpdateWidgetInDashboardInvoke } from "../updateWidgetInDashboard";

export function UpdateWidgetInvoke(
  currentWidget: Widget,
  widgetIndex: number,
  dataContainers?: DataContainer[]
): Method[] {
  const { widget, element } = extractWidgetData({
    widgetType: WidgetType[currentWidget.type],
    dataContainers,
    currentWidget,
  });

  return [
    RenderElementMethod.builder()
      .element(
        GridLayoutItem.builder()
          .id(widget.id)
          .item(element)
          .actionButtons(getWidgetActionButtons(widget))
          .build()
      )
      .build(),
    ...UpdateWidgetInDashboardInvoke(widget, widgetIndex),
    ...ShowAndHideModalInvoke({
      modalConfig: DEFAULT_MODAL_CONFIG,
      show: false,
    }),
  ];
}

interface RequestData {
  widget: Widget;
  widgetIndex: number;
}

export function UpdateWidgetPrepareInvoke(
  widget: Widget,
  widgetIndex: number,
  dataContainers: DataContainer[] = []
): Method[] {
  return [
    (HttpMethod.builder() as HttpMethodBuilder<RequestData>)
      .url("/api/skills/dashboard/widgets/updateWidget")
      .requestType("POST")
      .stateIds(dataContainers.map((dataContainer) => dataContainer.id))
      .requestData({
        data: {
          widget,
          widgetIndex,
        },
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
        elementStates,
      }: HttpMethodRequestBody<RequestData, any> = req.body;

      if (requestData === undefined) {
        res.status(400).end("Missing requestData");
        return;
      }

      res
        .status(200)
        .send(
          encode(
            Response.builder()
              .methods(
                UpdateWidgetInvoke(
                  requestData.data.widget,
                  requestData.data.widgetIndex,
                  elementStates
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
