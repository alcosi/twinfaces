"use server";

import { TwinsAPI } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { getAuthHeaders } from "../../libs";
import { FacePG001 } from "../types";

export async function fetchPageFace(pageFaceId: string): Promise<FacePG001> {
  const headers = await getAuthHeaders();

  const { data } = await TwinsAPI.GET("/private/face/pg001/{faceId}/v1", {
    params: {
      header: headers,
      path: { faceId: pageFaceId },
      query: {
        lazyRelation: false,
        showFaceMode: "DETAILED",
        showFacePG001WidgetCollectionMode: "SHOW",
      },
    },
  });

  if (isUndefined(data?.page)) {
    const message = `[fetchPageFace] Page face not found for faceId=${pageFaceId}`;
    console.warn(message);
    throw new Error(message);
  }

  return data?.page;
}
