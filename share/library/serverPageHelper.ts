import { GetServerSidePropsContext } from "next";

export function transferQueryData(
  url: string,
  context: GetServerSidePropsContext
): string {
  const queryPath = Object.entries(context.query)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return url.includes("?") ? `${url}&${queryPath}` : `${url}?${queryPath}`;
}
