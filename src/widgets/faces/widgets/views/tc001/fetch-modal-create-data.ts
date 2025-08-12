"use server";

import {
  FaceTC001ViewRs as FaceTC,
  FaceTC001,
  fetchTC001Face,
} from "@/entities/face";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { isUndefined, safe } from "@/shared/libs";

const componentToFetcherMap: Record<
  string,
  (modalFaceId: string, twinId: string) => Promise<FaceTC>
> = {
  TC001: fetchTC001Face,
};

export async function fetchModalCreateData(
  modalFace: FaceTC001,
  twinId: string
): Promise<FaceTC | undefined> {
  const fetcher = componentToFetcherMap[`${modalFace?.component}`];

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
