"use server";

import { fetchCurrentDomain } from "@/entities/domain/api/actions";
import { TwinsAPI } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { getAuthHeaders } from "../../libs";
import { Face, FaceNB001 } from "../types";

export async function fetchSidebarFace(): Promise<FaceNB001> {
  const { domain } = await fetchCurrentDomain();

  if (isUndefined(domain?.navbarFaceId))
    throw new Error("Navbar id is not found");

  return await fetchSidebarFaceById(domain.navbarFaceId);
}

async function fetchSidebarFaceById(faceId: string): Promise<Face> {
  const headers = await getAuthHeaders();

  const { data } = await TwinsAPI.GET("/private/face/nb001/{faceId}/v1", {
    params: {
      header: headers,
      path: { faceId },
      query: {
        lazyRelation: false,
        showFaceMode: "DETAILED",
        showFaceNB001MenuItem2FaceMode: "DETAILED",
        showFaceNB001MenuItemCollectionMode: "SHOW",
      },
    },
  });

  if (!data?.navbar) throw new Error("Navigation Face is not found!");

  return data.navbar;
}
