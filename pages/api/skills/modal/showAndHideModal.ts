import { NextApiRequest, NextApiResponse } from "next";
import { ModalConfig } from "server/application/modal/config";
import { encode } from "share/domain/engine/serializers";
import {
  HttpMethod,
  HttpMethodBuilder,
  HttpMethodRequestBody,
  Method,
  Response,
  UpdateStateMethod,
} from "share/domain/interfaces";
import { ModalSize } from "share/elements/components/widgets";

interface RequestData {
  modalConfig: ModalConfig;
  show: boolean;
  size?: ModalSize;
}

export function ShowAndHideModalInvoke({
  modalConfig,
  show,
  size = "xl",
}: RequestData): Method[] {
  return [
    UpdateStateMethod.builder()
      .stateElementId(modalConfig.stateId)
      .patches([
        {
          op: "replace",
          path: ["show"],
          value: show,
        },
        {
          op: "replace",
          path: ["size"],
          value: size,
        },
      ])
      .build(),
  ];
}

export function ShowAndHideModalPrepareInvoke(data: RequestData): Method[] {
  return [
    (HttpMethod.builder() as HttpMethodBuilder<RequestData>)
      .url("/api/skills/modal/showAndHideModal")
      .requestType("POST")
      .requestData({ data })
      .build(),
  ];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { requestData }: HttpMethodRequestBody<RequestData, any> = req.body;

  if (requestData === undefined) {
    res.status(400).end('Missing requestData');
    return;
  }

  switch (req.method) {
    case "POST":
      res
        .status(200)
        .send(
          encode(
            Response.builder()
              .methods(ShowAndHideModalInvoke(requestData.data))
              .build()
          )
        );

      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
