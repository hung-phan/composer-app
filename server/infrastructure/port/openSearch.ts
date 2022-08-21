import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { AwsCredentialIdentity } from "@aws-sdk/types";
import { Client, Connection } from "@opensearch-project/opensearch";
import aws4 from "aws4";
import { AWS_CONFIG, ELASTIC_SEARCH_HOST } from "server/config";

export namespace OpenSearch {
  const clients: { [key: string]: Client } = {};
  const DEFAULT_CLIENT = "DEFAULT_CLIENT";

  const createAwsConnector = (credentials, region) => {
    class AmazonConnection extends Connection {
      buildRequestObject(params) {
        const request = super.buildRequestObject(params);
        // @ts-ignore
        request.service = "es";
        // @ts-ignore
        request.region = region;

        request.headers = request.headers || {};
        // @ts-ignore
        request.headers["host"] = request.hostname;

        return aws4.sign(request, credentials);
      }
    }

    return {
      Connection: AmazonConnection,
    };
  };

  export async function getClient(id: string): Promise<Client> {
    if (clients[id] === undefined) {
      const credentials: AwsCredentialIdentity = await defaultProvider()();

      clients[id] = new Client({
        ...createAwsConnector(credentials, AWS_CONFIG.region),
        node: ELASTIC_SEARCH_HOST,
      });
    }

    return clients[id];
  }

  export function getDefaultClient(): Promise<Client> {
    return getClient(DEFAULT_CLIENT);
  }

  process.on("SIGTERM", () => {
    Object.values(clients).forEach((client) => client.close());
  });
}
