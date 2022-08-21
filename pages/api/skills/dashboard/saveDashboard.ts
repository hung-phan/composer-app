import { NextApiRequest, NextApiResponse } from "next";
import { encode } from "share/domain/engine/serializers";
import {
  DataContainer,
  HttpMethod,
  HttpMethodBuilder,
  HttpMethodRequestBody,
  Method,
  Response,
} from "share/domain/interfaces";
import { Widget } from "share/domain/widgets";
import { GridLayoutState } from "share/elements/components/widgets";
import { Id } from "share/library/idGenerator";

export function SaveDashboardInvoke(
  dataContainers?: DataContainer[]
): Method[] {
  const gridLayoutState: GridLayoutState | undefined =
    dataContainers?.[0] as GridLayoutState;

  console.log(JSON.stringify(gridLayoutState));

  return [];
}

export function SaveDashboardPrepareInvoke(state: GridLayoutState): Method[] {
  return [
    (HttpMethod.builder() as HttpMethodBuilder<Id>)
      .url("/api/skills/dashboard/saveDashboard")
      .requestType("POST")
      .stateIds([state.id])
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
      const { elementStates }: HttpMethodRequestBody<Widget, any> = req.body;

      res
        .status(200)
        .send(
          encode(
            Response.builder()
              .methods(SaveDashboardInvoke(elementStates))
              .build()
          )
        );

      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
