"use server";

import { TwinsAPI } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { getAuthHeaders } from "../../libs";
import { FacePG001, FacePG002 } from "../types";

type FetchPGFaceOptions = {
  faceId: string;
  endpoint:
    | "/private/face/pg001/{faceId}/v1"
    | "/private/face/pg002/{faceId}/v1";
  twinId?: string;
  query?: Record<string, string | boolean>;
};

async function fetchPGFace<T>({
  faceId,
  endpoint,
  query = {},
  twinId,
}: FetchPGFaceOptions): Promise<T> {
  const headers = await getAuthHeaders();

  const { data } = await TwinsAPI.GET(endpoint, {
    params: {
      header: headers,
      path: { faceId },
      query: {
        twinId,
        lazyRelation: false,
        showFaceMode: "DETAILED",
        ...query,
      },
    },
  });

  if (isUndefined(data?.page)) {
    const message = `[${endpoint}] Page face not found for faceId=${faceId}`;
    console.warn(message);
    throw new Error(message);
  }

  return data.page as T;
}

export async function fetchPG001Face(
  faceId: string,
  twinId?: string
): Promise<FacePG001> {
  return fetchPGFace<FacePG001>({
    faceId,
    endpoint: "/private/face/pg001/{faceId}/v1",
    query: {
      showFacePG001WidgetCollectionMode: "SHOW",
    },
    twinId,
  });
}

export async function fetchPG002Face(
  faceId: string,
  twinId?: string
): Promise<FacePG002> {
  return fetchPGFace<FacePG002>({
    faceId,
    endpoint: "/private/face/pg002/{faceId}/v1",
    query: {
      showFacePG002TabCollectionMode: "SHOW",
      showFacePG002TabWidgetCollectionMode: "SHOW",
    },
    twinId,
  });
}
