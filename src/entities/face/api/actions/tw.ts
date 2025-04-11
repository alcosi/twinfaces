"use server";

import { TwinsAPI } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { getAuthHeaders } from "../../libs";
import { FaceTW001, FaceTW002, FaceTW004 } from "../types";

export async function fetchTW001Face(
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
        showFaceTW0012TwinClassFieldMode: "MANAGED",
        showFaceTwidget2TwinMode: "DETAILED",
        showAttachment2TwinMode: "DETAILED",
        showTwin2AttachmentCollectionMode: "ALL",
        showTwin2AttachmentMode: "DETAILED",
      },
    },
  });

  if (isUndefined(data?.widget)) {
    const message = `[fetchTW001Face] Widget not found for faceId=${faceId}, twinId=${twinId}`;
    console.warn(message);
    throw new Error(message);
  }

  return data.widget;
}

export async function fetchTW002Face(
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
    const message = `[fetchTW002Face] Widget not found for faceId=${faceId}, twinId=${twinId}`;
    console.warn(message);
    throw new Error(message);
  }

  return data.widget;
}

export async function fetchTW004Face(
  faceId: string,
  twinId: string
): Promise<FaceTW004> {
  const headers = await getAuthHeaders();

  const { data } = await TwinsAPI.GET("/private/face/tw004/{faceId}/v1", {
    params: {
      path: { faceId },
      header: headers,
      query: {
        twinId: twinId,
        lazyRelation: false,
        showFaceMode: "DETAILED",
        showFaceTW0042TwinClassFieldMode: "SHORT",
        showFaceTwidget2TwinMode: "DETAILED",
      },
    },
  });

  if (isUndefined(data?.widget)) {
    const message = `[fetchTW004Face] Widget not found for faceId=${faceId}, twinId=${twinId}`;
    console.warn(message);
    throw new Error(message);
  }

  return data.widget;
}
