"use server";

import { notFound } from "next/navigation";

import { TwinsAPI } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { getAuthHeaders } from "../../libs";
import { FaceWT001 } from "../types";

export async function fetchWT001Face(faceId: string): Promise<FaceWT001> {
  const headers = await getAuthHeaders();

  const { data } = await TwinsAPI.GET("/private/face/wt001/{faceId}/v1", {
    params: {
      path: { faceId },
      header: headers,
      query: {
        lazyRelation: false,
        showFaceMode: "DETAILED",
      },
    },
  });

  if (isUndefined(data?.widget)) {
    notFound();
  }

  return data.widget as FaceWT001;
}
