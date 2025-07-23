"use server";

import { fetchTC001Face, fetchTC002Face } from "@/entities/face";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { isUndefined, safe } from "@/shared/libs";

import { TCSchemaMap, TCViewMap } from "./types";

const componentToFetcherMap: {
  [K in keyof TCViewMap]: (
    modalFaceId: string,
    twinId: string
  ) => Promise<TCViewMap[K]>;
} = {
  TC001: fetchTC001Face,
  TC002: fetchTC002Face,
};

export async function fetchModalCreateData<K extends keyof TCViewMap>(
  modalFace: TCSchemaMap[K],
  twinId: string
): Promise<TCViewMap[K] | undefined> {
  const fetcher = componentToFetcherMap[`${modalFace?.component}` as K];

  if (isUndefined(fetcher)) {
    console.error(`No fetcher mapped for component: ${modalFace?.component}`);
    return undefined;
  }

  const modalFaceResult = await safe(
    withRedirectOnUnauthorized(() => fetcher(modalFace.id!, twinId))
  );

  if (!modalFaceResult.ok) {
    console.error(
      `Failed to load modal face data for component ${modalFace?.component}:`,
      modalFaceResult.error
    );
    return undefined;
  }

  return modalFaceResult.data;
}
