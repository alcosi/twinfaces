"use server";

import { TwinsAPI } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { getAuthHeaders } from "../../libs";
import { FacePG001, FacePG002 } from "../types";

export async function fetchPG001Face(pageFaceId: string): Promise<FacePG001> {
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
    const message = `[fetchPG001Face] Page face not found for faceId=${pageFaceId}`;
    console.warn(message);
    throw new Error(message);
  }

  return data?.page;
}

export async function fetchPG002Face(pageFaceId: string): Promise<FacePG002> {
  const headers = await getAuthHeaders();

  const { data } = await TwinsAPI.GET("/private/face/pg002/{faceId}/v1", {
    params: {
      header: headers,
      path: { faceId: pageFaceId },
      query: {
        lazyRelation: false,
        showFaceMode: "DETAILED",
        showFacePG002TabCollectionMode: "SHOW",
        showFacePG002TabWidgetCollectionMode: "SHOW",
      },
    },
  });

  if (isUndefined(data?.page)) {
    const message = `[fetchPG002Face] Page face not found for faceId=${pageFaceId}`;
    console.warn(message);
    throw new Error(message);
  }

  return data?.page;
}
