"use server";

import { TwinsAPI } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { getAuthHeaders } from "../../libs";
import { FaceTW001, FaceTW002, FaceTW004, FaceTW005 } from "../types";
import { FaceWT001, FaceWT003 } from "../types";

type FetchFaceOptions = {
  faceId: string;
  twinId?: string;
  endpoint:
    | "/private/face/wt001/{faceId}/v1"
    | "/private/face/wt003/{faceId}/v1"
    | "/private/face/tw001/{faceId}/v1"
    | "/private/face/tw002/{faceId}/v1"
    | "/private/face/tw004/{faceId}/v1"
    | "/private/face/tw005/{faceId}/v1";
  query: Record<string, any>;
};

async function fetchFaceWidget<T>({
  twinId,
  faceId,
  endpoint,
  query,
}: FetchFaceOptions): Promise<T> {
  const headers = await getAuthHeaders();

  const { data } = await TwinsAPI.GET(endpoint, {
    params: {
      path: { faceId },
      header: headers,
      query: {
        twinId,
        lazyRelation: false,
        showFaceMode: "DETAILED",
        ...query,
      },
    },
  });

  if (isUndefined(data?.widget)) {
    const message = `[${endpoint}] Widget not found for faceId=${faceId}, twinId=${twinId}`;
    console.warn(message);
    throw new Error(message);
  }

  return data.widget as T;
}

export async function fetchWT001Face(
  faceId: string,
  twinId?: string
): Promise<FaceWT001> {
  return fetchFaceWidget<FaceWT001>({
    faceId,
    endpoint: "/private/face/wt001/{faceId}/v1",
    twinId,
    query: {},
  });
}

export async function fetchWT003Face(
  faceId: string,
  twinId?: string
): Promise<FaceWT003> {
  return fetchFaceWidget<FaceWT003>({
    faceId,
    endpoint: "/private/face/wt003/{faceId}/v1",
    twinId,
    query: {},
  });
}

export async function fetchTW001Face(
  faceId: string,
  twinId: string
): Promise<FaceTW001> {
  return fetchFaceWidget<FaceTW001>({
    endpoint: "/private/face/tw001/{faceId}/v1",
    twinId,
    faceId,
    query: {
      showFaceTW0012TwinClassFieldMode: "MANAGED",
      showFaceTwidget2TwinMode: "DETAILED",
      showAttachment2TwinMode: "DETAILED",
      showTwin2AttachmentCollectionMode: "ALL",
      showTwin2AttachmentMode: "DETAILED",
    },
  });
}

export async function fetchTW002Face(
  faceId: string,
  twinId: string
): Promise<FaceTW002> {
  return fetchFaceWidget<FaceTW002>({
    endpoint: "/private/face/tw002/{faceId}/v1",
    twinId,
    faceId,
    query: {},
  });
}

export async function fetchTW004Face(
  faceId: string,
  twinId: string
): Promise<FaceTW004> {
  return fetchFaceWidget<FaceTW004>({
    endpoint: "/private/face/tw004/{faceId}/v1",
    twinId,
    faceId,
    query: {
      showFaceTW0042TwinClassFieldMode: "SHORT",
      showFaceTwidget2TwinMode: "DETAILED",
    },
  });
}

export async function fetchTW005Face(
  faceId: string,
  twinId: string
): Promise<FaceTW005> {
  return fetchFaceWidget<FaceTW005>({
    endpoint: "/private/face/tw005/{faceId}/v1",
    twinId,
    faceId,
    query: {
      showFaceTW005Button2TransitionMode: "DETAILED",
      showFaceTwidget2TwinMode: "DETAILED",
    },
  });
}
