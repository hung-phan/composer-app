import _ from "lodash";
import { NextApiRequest } from "next";

export function getQueryData(
  req: NextApiRequest,
  queryName: string
): string | string[] | undefined {
  const queryData = req.query[queryName];

  if (queryData === undefined) {
    return undefined;
  }

  if (_.isString(queryData) && queryData[queryData.length - 1] === "?") {
    return queryData.substring(0, queryData.length - 1);
  }

  return queryData;
}
