import { S3Client } from "@aws-sdk/client-s3";

export namespace S3 {
  const clients: { [key: string]: S3Client } = {};
  const DEFAULT_CLIENT = "DEFAULT_CLIENT";

  export function getClient(id: string): S3Client {
    if (clients[id] === undefined) {
      clients[id] = new S3Client({});
    }

    return clients[id];
  }

  export function getDefaultClient(): S3Client {
    return getClient(DEFAULT_CLIENT);
  }

  process.on("SIGTERM", () => {
    Object.values(clients).forEach((client) => client.destroy());
  });
}
