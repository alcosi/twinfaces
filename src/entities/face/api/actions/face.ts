"use server";

import { TwinsAPI } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { getAuthHeaders } from "../../libs";
import { Face, FaceViewQuery } from "../types";

export async function fetchFaceById<T extends Face>(
  faceId: string,
  options: {
    query?: FaceViewQuery;
  }
): Promise<T> {
  const header = await getAuthHeaders();

  const { data, error } = await TwinsAPI.GET("/private/face/{faceId}/v1", {
    params: {
      header,
      path: { faceId },
      query: {
        lazyRelation: false,
        ...options.query,
      },
    },
  });

  if (error) {
    throw new Error(
      `Failed to fetch face with id ${faceId}: ${error.message ?? "Unknown error"}`
    );
  }

  if (isUndefined(data.face)) {
    throw new Error(`Face with id ${faceId} not found in response.`);
  }

  return data.face as T;
}
