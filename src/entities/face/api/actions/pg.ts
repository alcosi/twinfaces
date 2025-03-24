"use server";

import { notFound } from "next/navigation";

import { TwinsAPI } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { getAuthTokenFromCookies, getDomainIdFromCookies } from "../../libs";
import { FacePG001 } from "../types";

export async function fetchPageFace(pageFaceId: string): Promise<FacePG001> {
  const domainId = await getDomainIdFromCookies();
  if (!domainId) return {} as FacePG001;

  const AuthToken = await getAuthTokenFromCookies();

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
