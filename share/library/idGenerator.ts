import { ulid } from "ulid";

export type Id = string;

export function getRandomUUID(): Id {
  if (process.env.ENVIRONMENT === "client") {
    return window.crypto.randomUUID();
  }

  const cryptoLib = require("crypto");

  return cryptoLib.randomUUID();
}

export function getRandomSortableId(): Id {
  return ulid();
}
