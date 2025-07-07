"use server";

import { FaceTC001ViewRs as FaceTC, fetchTC001Face } from "@/entities/face";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { RelatedObjects } from "@/shared/api";
import { isUndefined, safe } from "@/shared/libs";

const componentToFetcherMap: Record<
  string,
  (modalFaceId: string, twinId: string) => Promise<FaceTC>
> = {
  TC001: fetchTC001Face,
};

export async function fetchModalCreateData(
  modalFaceId: string,
  twinId: string,
  relatedObjects?: RelatedObjects
): Promise<FaceTC | undefined> {
  const modalFace = relatedObjects?.faceMap?.[modalFaceId];
  const fetcher = componentToFetcherMap[`${modalFace?.component}`];

  if (isUndefined(fetcher)) {
    console.error(`No fetcher mapped for component: ${modalFace?.component}`);
    return undefined;
  }

  const modalFaceResult = await safe(
    withRedirectOnUnauthorized(() => fetcher(modalFaceId, twinId))
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
