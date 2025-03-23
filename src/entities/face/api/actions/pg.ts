"use server";

import { notFound } from "next/navigation";

import { TwinsAPI } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { FacePG001 } from "../types";
import { getAuthTokenFromHeaders, getDomainIdFromHeaders } from "./headers";

export async function fetchPageFace(pageFaceId: string): Promise<FacePG001> {
  const domainId = getDomainIdFromHeaders();
  if (!domainId) return {} as FacePG001;

  const AuthToken = await getAuthTokenFromHeaders();

  const { data } = await TwinsAPI.GET("/private/face/pg001/{faceId}/v1", {
    params: {
      header: {
        DomainId: domainId,
        AuthToken,
        Channel: "WEB",
      },
      path: { faceId: pageFaceId },
      query: {
        lazyRelation: false,
        showFaceMode: "DETAILED",
        showFacePG001WidgetCollectionMode: "SHOW",
        // showFacePG001Widget2FaceMode: "DETAILED",
      },
    },
  });

  if (isUndefined(data?.page)) {
    notFound();
  }

  return data?.page;
}
