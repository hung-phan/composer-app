import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { pipe } from "@effect/data/Function";
import * as E from "@effect/io/Effect";
import { Builder } from "builder-pattern";
import pino from "pino";
import { DASHBOARD_CONFIG } from "server/config";
import { Dashboard } from "server/domain/Dashboard";
import { OpenSearch, S3 } from "server/infrastructure/port";
import { Id } from "share/library/idGenerator";

const logger = pino();

export function exist(id: Id): E.Effect<never, Error, boolean> {
  return E.tryCatchPromise(
    () =>
      OpenSearch.getDefaultClient()
        .then((client) =>
          client.search({
            index: DASHBOARD_CONFIG.indexName,
            q: `id:${id}`,
          })
        )
        .then((result) => result.body.hits > 0),
    (e) => new Error(`Failed to search for "${id}": ${e}`)
  );
}

export function getById(id: Id): E.Effect<never, Error, Dashboard> {
  return pipe(
    exist(id),
    E.flatMap((exist) => {
      if (!exist) {
        return E.fail(new Error(`Dashboard not found: ${id}`));
      }

      return E.tryCatchPromise(
        () =>
          S3.getDefaultClient()
            .send(
              new GetObjectCommand({
                Bucket: DASHBOARD_CONFIG.bucketName,
                Key: `${id}.json`,
              })
            )
            .then((response) => {
              const responseBody = response.Body;

              if (!responseBody) {
                throw new Error("Cannot process empty response body");
              }

              return responseBody
                .transformToString()
                .then((body) => Builder(Dashboard, JSON.parse(body)).build());
            }),
        (e) => new Error(`Failed to get data from S3 for "${id}": ${e}`)
      );
    }),
    E.tapError((a) => E.sync(() => logger.error(a)))
  );
}

function createOrUpdateIndex(
  dashboard: Dashboard
): E.Effect<never, Error, Dashboard> {
  return pipe(
    E.tryCatchPromise(
      () =>
        OpenSearch.getDefaultClient().then((client) =>
          client.index({
            id: dashboard.id,
            body: {
              title: dashboard.title,
            },
            index: DASHBOARD_CONFIG.indexName,
            refresh: true,
          })
        ),
      () => new Error(`Fail to update index for dashboard: ${dashboard.id}`)
    ),
    E.flatMap((response) => {
      return response.statusCode === 200
        ? E.succeed(dashboard)
        : E.fail(
            new Error(
              `Failed to createOrUpdateIndex for dashboard "${dashboard.id}"`
            )
          );
    })
  );
}

export function createOrUpdate(
  dashboard: Dashboard
): E.Effect<never, Error, Dashboard> {
  return pipe(
    createOrUpdateIndex(dashboard),
    E.flatMap(() =>
      E.tryCatchPromise(
        () =>
          S3.getDefaultClient()
            .send(
              new PutObjectCommand({
                Bucket: DASHBOARD_CONFIG.bucketName,
                Key: `${dashboard.id}.json`,
                Body: Buffer.from(JSON.stringify(dashboard)),
                ContentType: "application/json",
              })
            )
            .then(() => dashboard),
        (e) =>
          new Error(`Failed to store dashboard "${dashboard.id}" to S3: ${e}`)
      )
    ),
    E.tapError((a) => E.sync(() => logger.error(a)))
  );
}

export function remove(id: Id): E.Effect<never, Error, boolean> {
  return pipe(
    E.allPar(
      E.tryCatchPromise(
        () =>
          OpenSearch.getDefaultClient().then((client) =>
            client.delete({
              index: DASHBOARD_CONFIG.indexName,
              id,
            })
          ),
        () => new Error(`Fail to remove dashboard index: ${id}`)
      ),
      E.tryCatchPromise(
        () =>
          S3.getDefaultClient().send(
            new DeleteObjectCommand({
              Bucket: DASHBOARD_CONFIG.bucketName,
              Key: `${id}.json`,
            })
          ),
        () => new Error(`Fail to remove dashboard: ${id}`)
      )
    ),
    E.flatMap((_) => E.succeed(true)),
    E.tapError((a) => E.sync(() => logger.error(a)))
  );
}
