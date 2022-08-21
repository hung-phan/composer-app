import { Builder } from "builder-pattern";
import { NextApiRequest, NextApiResponse } from "next";
import { Layouts } from "react-grid-layout";
import {
  LAYOUT_PLACEHOLDER_CONFIG,
  WIDGET_LAYOUT_PLACEHOLDER_ID,
  WIDGET_LAYOUT_STATE_ID,
} from "server/application/dashboard/config";
import { getDefaultModal } from "server/application/modal/config";
import { EmptyWidget } from "server/domain/widgets/types";
import { ROOT_ID } from "share/domain/engine";
import { encode } from "share/domain/engine/serializers";
import { Method, RenderElementMethod, Response } from "share/domain/interfaces";
import {
  Button,
  ContextMenu,
  GridLayout,
  GridLayoutItem,
  GridLayoutState,
  Icon,
  Layout,
  Text,
} from "share/elements/components/widgets";
import { DefaultTemplate } from "share/elements/templateComponents/templates";

import { ShowSelectionModalPrepareInvoke } from "./modal/showSelectionModal";
import { SaveDashboardPrepareInvoke } from "./saveDashboard";

export function ShowDashboardInvoke(): Method[] {
  const layouts: Layouts = {
    md: [LAYOUT_PLACEHOLDER_CONFIG],
    lg: [LAYOUT_PLACEHOLDER_CONFIG]
  };
  const gridLayoutState = GridLayoutState.builder()
    .id(WIDGET_LAYOUT_STATE_ID)
    .layouts(layouts)
    .widgets([Builder(EmptyWidget).id(WIDGET_LAYOUT_PLACEHOLDER_ID).build()])
    .build();

  return [
    RenderElementMethod.builder()
      .element(
        DefaultTemplate.builder()
          .id(ROOT_ID)
          .widgets([
            getDefaultModal(),
            Layout.builder()
              .items([
                Text.builder()
                  .variant("h1")
                  .message("Dashboard's title")
                  .class("self-center")
                  .build(),
                Layout.builder()
                  .direction("horizontal")
                  .items([
                    Button.builder()
                      .label("Add")
                      .onSelected(ShowSelectionModalPrepareInvoke())
                      .build(),
                    Button.builder()
                      .label("Save")
                      .onSelected(SaveDashboardPrepareInvoke(gridLayoutState))
                      .build(),
                    ContextMenu.builder()
                      .items([
                        {
                          description: "Delete",
                          methods: [],
                        },
                      ])
                      .icon(
                        Icon.builder()
                          .icon("MdMoreHoriz")
                          .class("w-6 h-6")
                          .build()
                      )
                      .build(),
                  ])
                  .class("self-center")
                  .build(),
                gridLayoutState,
                GridLayout.builder()
                  .stateId(gridLayoutState.id)
                  .items([
                    GridLayoutItem.builder()
                      .id(WIDGET_LAYOUT_PLACEHOLDER_ID)
                      .build(),
                  ])
                  .build(),
              ])
              .class("pt-6")
              .build(),
          ])
          .build()
      )
      .build(),
  ];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      res
        .status(200)
        .send(
          encode(Response.builder().methods(ShowDashboardInvoke()).build())
        );

      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
