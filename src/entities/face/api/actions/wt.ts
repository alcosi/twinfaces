"use server";

import { notFound } from "next/navigation";

import { TwinsAPI } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { getAuthHeaders } from "../../libs";
import { FaceWT001, FaceWT003 } from "../types";

type FetchFaceOptions = {
  faceId: string;
  endpoint:
    | "/private/face/wt001/{faceId}/v1"
    | "/private/face/wt003/{faceId}/v1";
  query?: Record<string, string | boolean>;
  twinId?: string;
};

async function fetchFaceWidget<T>({
  faceId,
  endpoint,
  query = {},
  twinId,
}: FetchFaceOptions): Promise<T> {
  const headers = await getAuthHeaders();

  const { data } = await TwinsAPI.GET(endpoint, {
    params: {
      path: { faceId },
      header: headers,
      query: {
        twinId,
        lazyRelation: false,
        showFaceMode: "DETAILED",
        ...query,
      },
    },
  });

  if (isUndefined(data?.widget)) {
    notFound();
  }

  return data.widget as T;
}

export async function fetchWT001Face(
  faceId: string,
  twinId?: string
): Promise<FaceWT001> {
  return fetchFaceWidget<FaceWT001>({
    faceId,
    endpoint: "/private/face/wt001/{faceId}/v1",
    twinId,
  });
}

export async function fetchWT003Face(
  faceId: string,
  twinId?: string
): Promise<FaceWT003> {
  return fetchFaceWidget<FaceWT003>({
    faceId,
    endpoint: "/private/face/wt003/{faceId}/v1",
    twinId,
  });
}
