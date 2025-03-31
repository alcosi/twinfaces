"use server";

import { TwinsAPI } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { getAuthHeaders } from "../../libs";
import { FaceTW001, FaceTW002 } from "../types";

export async function fetchTwidgetFace(
  faceId: string,
  twinId: string
): Promise<FaceTW001> {
  const headers = await getAuthHeaders();

  const { data } = await TwinsAPI.GET("/private/face/tw001/{faceId}/v1", {
    params: {
      path: { faceId },
      header: headers,
      query: {
        twinId: twinId,
        lazyRelation: false,
        showFaceMode: "DETAILED",
      },
    },
  });

  if (isUndefined(data?.widget)) {
    const message = `[fetchTwidgetFace] Widget not found for faceId=${faceId}, twinId=${twinId}`;
    console.warn(message);
    throw new Error(message);
  }

  return data.widget as FaceTW001;
}

export async function fetchTwidget2Face(
  faceId: string,
  twinId: string
): Promise<FaceTW002> {
  const headers = await getAuthHeaders();

  const { data } = await TwinsAPI.GET("/private/face/tw002/{faceId}/v1", {
    params: {
      path: { faceId },
      header: headers,
      query: {
        twinId: twinId,
        lazyRelation: false,
        showFaceMode: "DETAILED",
      },
    },
  });

  if (isUndefined(data?.widget)) {
    const message = `[fetchTwidget2Face] Widget not found for faceId=${faceId}, twinId=${twinId}`;
    console.warn(message);
    throw new Error(message);
  }

  return data.widget as FaceTW002;
}
