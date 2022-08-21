import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export namespace DynamoDb {
  const clients: { [key: string]: DynamoDBClient } = {};
  const DEFAULT_CLIENT = "DEFAULT_CLIENT";

  // https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-example-dynamodb-utilities.html
  const marshallOptions = {
    // Whether to automatically convert empty strings, blobs, and sets to `null`.
    convertEmptyValues: false, // false, by default.
    // Whether to remove undefined values while marshalling.
    removeUndefinedValues: false, // false, by default.
    // Whether to convert typeof object to map attribute.
    convertClassInstanceToMap: false, // false, by default.
  };

  const unmarshallOptions = {
    // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
    wrapNumbers: false, // false, by default.
  };

  const translateConfig = { marshallOptions, unmarshallOptions };

  export function getClient(id: string): DynamoDBDocumentClient {
    if (clients[id] === undefined) {
      clients[id] = new DynamoDBClient({});
    }

    return DynamoDBDocumentClient.from(clients[id], translateConfig);
  }

  export function getDefaultClient(): DynamoDBClient {
    return DynamoDBDocumentClient.from(
      getClient(DEFAULT_CLIENT),
      translateConfig
    );
  }

  process.on("SIGTERM", () => {
    Object.values(clients).forEach((client) => client.destroy());
  });
}
