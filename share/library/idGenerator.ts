export type Id = string;

export default function getNewId(): Id {
  if (process.env.ENVIRONMENT === "client") {
    return window.crypto.randomUUID();
  }

  const cryptoLib = require("crypto");

  return cryptoLib.randomUUID();
}
