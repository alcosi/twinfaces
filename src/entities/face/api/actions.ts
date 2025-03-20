"use server";

import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { fetchDomainById } from "@/entities/domain/api/actions";
import { TwinsAPI } from "@/shared/api";
import { RemoteConfig } from "@/shared/config";
import { isUndefined } from "@/shared/libs";

import { Face, FaceNB001, FacePG001, FaceWT001 } from "./types";

export async function fetchSidebarFace(): Promise<FaceNB001> {
  const domainId = getDomainIdFromHeaders();
  if (!domainId) throw new Error("Domain ID not found in headers");

  const { domain } = await fetchDomainById(domainId);
  if (!domain?.navbarFaceId) throw new Error("Navbar id is not found");

  return fetchSidebarFaceById(domain.navbarFaceId, domainId);
}

export async function fetchPageFace(pageFaceId: string): Promise<FacePG001> {
  const domainId = getDomainIdFromHeaders();
  if (!domainId) return {} as FacePG001;

  const { data } = await TwinsAPI.GET("/private/face/pg001/{faceId}/v1", {
    params: {
      header: {
        DomainId: domainId,
        AuthToken: "608c6d7d-99c8-4d87-89c6-2f72d0f5d673",
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

export async function fetchWidgetFace(faceId: string): Promise<FaceWT001> {
  const domainId = getDomainIdFromHeaders();
  if (!domainId) {
    throw new Error("Domain ID not found in headers");
  }

  const { data } = await TwinsAPI.GET("/private/face/wt001/{faceId}/v1", {
    params: {
      path: { faceId },
      header: {
        DomainId: domainId,
        AuthToken: "608c6d7d-99c8-4d87-89c6-2f72d0f5d673",
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

function getDomainIdFromHeaders(): string | undefined {
  const header = headers().get("X-Domain-Config");
  if (!header) return undefined;
  return (JSON.parse(header) as RemoteConfig)?.id;
}

async function fetchSidebarFaceById(
  faceId: string,
  domainId: string
): Promise<Face> {
  const { data } = await TwinsAPI.GET("/private/face/nb001/{faceId}/v1", {
    params: {
      header: {
        DomainId: domainId,
        AuthToken: "608c6d7d-99c8-4d87-89c6-2f72d0f5d673",
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
