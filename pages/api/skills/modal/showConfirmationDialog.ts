import { Builder } from "builder-pattern";
import { NextApiRequest, NextApiResponse } from "next";
import { ModalConfig } from "server/application/modal/config";
import { encode } from "share/domain/engine/serializers";
import {
  BatchRenderElementMethod,
  HttpMethod,
  HttpMethodBuilder,
  HttpMethodRequestBody,
  Method,
  Response,
} from "share/domain/interfaces";
import { Button, Layout, Text } from "share/elements/components/widgets";

import {
  ShowAndHideModalInvoke,
  ShowAndHideModalPrepareInvoke,
} from "./showAndHideModal";

export function ShowConfirmationDialogInvoke(
  modalConfig: ModalConfig,
  confirmationMessage: string,
  confirmationMethods: Method[]
): Method[] {
  return [
    BatchRenderElementMethod.builder()
      .elements([
        Layout.builder()
          .id(modalConfig.bodyPlaceholder)
          .items([
            Text.builder().variant("h5").message(confirmationMessage).build(),
          ])
          .build(),
        Layout.builder()
          .id(modalConfig.footerPlaceholder)
          .direction("horizontal")
          .items([
            Button.builder()
              .variant("text")
              .color("red")
              .label("Cancel")
              .onSelected(
                ShowAndHideModalPrepareInvoke({
                  modalConfig,
                  show: false,
                })
              )
              .build(),
            Button.builder()
              .label("Confirm")
              .onSelected([
                ...confirmationMethods,
                ...ShowAndHideModalPrepareInvoke({
                  modalConfig,
                  show: false,
                }),
              ])
              .build(),
          ])
          .build(),
      ])
      .build(),
    ...ShowAndHideModalInvoke({
      modalConfig,
      show: true,
      size: "md",
    }),
  ];
}

interface RequestData {
  modalConfig: ModalConfig;
  confirmationMessage: string;
  confirmationMethods: Method[];
}

export function ShowConfirmationDialogPrepareInvoke(
  modalConfig: ModalConfig,
  confirmationMessage: string,
  confirmationMethods: Method[]
): Method[] {
  if (confirmationMethods.some((method) => !(method instanceof HttpMethod))) {
    throw new Error("confirmationMethods should only contain HttpMethod skill");
  }

  return [
    (HttpMethod.builder() as HttpMethodBuilder<RequestData>)
      .url("/api/skills/modal/showConfirmationDialog")
      .requestType("POST")
      .requestData({
        data: {
          modalConfig,
          confirmationMessage,
          confirmationMethods,
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
        clientInfo,
      }: HttpMethodRequestBody<RequestData, any> = req.body;
      if (requestData === undefined) {
        res.status(400).end("Missing requestData");
        return;
      }

      if (clientInfo === undefined) {
        res.status(400).end("Missing clientInfo");
        return;
      }

      const { modalConfig, confirmationMessage, confirmationMethods } =
        requestData.data;

      res.status(200).send(
        encode(
          Response.builder()
            .methods(
              ShowConfirmationDialogInvoke(
                modalConfig,
                confirmationMessage,
                confirmationMethods.map((method) =>
                  Builder(method as HttpMethod<any>)
                    .forwardedClientInfo(clientInfo)
                    .build()
                )
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
