import _ from "lodash";

import { ClientInfo } from "./interfaces";

export interface IndexInCollection {
  indexInCollection: number;
}

export function extractClientInfoFromProps(
  props?: IndexInCollection | undefined
): ClientInfo<any> | undefined {
  const clientInfo = {
    data: {},
  };

  if (props?.indexInCollection) {
    clientInfo.data["indexInCollection"] = props.indexInCollection;
  }

  if (_.isEmpty(clientInfo.data)) {
    return undefined;
  }

  return clientInfo;
}
