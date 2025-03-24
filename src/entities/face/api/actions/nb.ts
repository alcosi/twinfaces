"use server";

import { fetchDomainById } from "@/entities/domain/api/actions";
import { TwinsAPI } from "@/shared/api";

import { getAuthTokenFromCookies, getDomainIdFromCookies } from "../../libs";
import { Face, FaceNB001 } from "../types";

export async function fetchSidebarFace(): Promise<FaceNB001> {
  const domainId = await getDomainIdFromCookies();
  if (!domainId) throw new Error("Domain ID not found in headers");

  const { domain } = await fetchDomainById(domainId);
  if (!domain?.navbarFaceId) throw new Error("Navbar id is not found");

  return fetchSidebarFaceById(domain.navbarFaceId, domainId);
}

async function fetchSidebarFaceById(
  faceId: string,
  domainId: string
): Promise<Face> {
  const AuthToken = await getAuthTokenFromCookies();

  const { data } = await TwinsAPI.GET("/private/face/nb001/{faceId}/v1", {
    params: {
      header: {
        DomainId: domainId,
        AuthToken,
        Channel: "WEB",
      },
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
