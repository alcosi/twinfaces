"use server";

import { notFound } from "next/navigation";

import { TwinsAPI } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { FaceWT001 } from "../types";
import { getAuthTokenFromHeaders, getDomainIdFromHeaders } from "./headers";

export async function fetchWidgetFace(faceId: string): Promise<FaceWT001> {
  const domainId = getDomainIdFromHeaders();
  if (!domainId) {
    throw new Error("Domain ID not found in headers");
  }

  const AuthToken = await getAuthTokenFromHeaders();

  const { data } = await TwinsAPI.GET("/private/face/wt001/{faceId}/v1", {
    params: {
      path: { faceId },
      header: {
        DomainId: domainId,
        AuthToken,
        Channel: "WEB",
      },
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
