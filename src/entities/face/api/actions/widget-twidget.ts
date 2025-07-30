"use server";

import { TwinsAPI } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { getAuthHeaders } from "../../libs";
import {
  FaceTC001ViewRs,
  FaceTW001ViewRs,
  FaceTW002ViewRs,
  FaceTW004ViewRs,
  FaceTW005ViewRs,
  FaceWT001ViewRs,
  FaceWT002ViewRs,
  FaceWT003ViewRs,
} from "../types";

type FetchFaceOptions = {
  faceId: string;
  twinId?: string;
  endpoint:
    | "/private/face/wt001/{faceId}/v1"
    | "/private/face/wt002/{faceId}/v1"
    | "/private/face/wt003/{faceId}/v1"
    | "/private/face/tw001/{faceId}/v1"
    | "/private/face/tw002/{faceId}/v1"
    | "/private/face/tw004/{faceId}/v1"
    | "/private/face/tw005/{faceId}/v1"
    | "/private/face/tc001/{faceId}/v1";
  query: Record<string, string>;
};

async function fetchFace<T>({
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

  if (isUndefined(data)) {
    const message = `[${endpoint}] Widget not found for faceId=${faceId}, twinId=${twinId}`;
    console.warn(message);
    throw new Error(message);
  }

  return data as T;
}

export async function fetchWT001Face(
  faceId: string,
  twinId?: string
): Promise<FaceWT001ViewRs> {
  return fetchFace<FaceWT001ViewRs>({
    faceId,
    endpoint: "/private/face/wt001/{faceId}/v1",
    twinId,
    query: {
      showModalFace2FaceMode: "DETAILED",
      showFaceWT001Column2TwinClassFieldMode: "MANAGED",
    },
  });
}

export async function fetchWT002Face(
  faceId: string,
  twinId?: string
): Promise<FaceWT002ViewRs> {
  return fetchFace<FaceWT002ViewRs>({
    faceId,
    endpoint: "/private/face/wt002/{faceId}/v1",
    twinId,
    query: {
      showFaceWT002Button2TwinClassMode: "DETAILED",
      showModalFace2FaceMode: "DETAILED",
    },
  });
}

export async function fetchWT003Face(
  faceId: string,
  twinId?: string
): Promise<FaceWT003ViewRs> {
  return fetchFace<FaceWT003ViewRs>({
    faceId,
    endpoint: "/private/face/wt003/{faceId}/v1",
    twinId,
    query: {},
  });
}

export async function fetchTW001Face(
  faceId: string,
  twinId: string
): Promise<FaceTW001ViewRs> {
  return fetchFace<FaceTW001ViewRs>({
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
): Promise<FaceTW002ViewRs> {
  return fetchFace<FaceTW002ViewRs>({
    endpoint: "/private/face/tw002/{faceId}/v1",
    twinId,
    faceId,
    query: {},
  });
}

export async function fetchTW004Face(
  faceId: string,
  twinId: string
): Promise<FaceTW004ViewRs> {
  return fetchFace<FaceTW004ViewRs>({
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
): Promise<FaceTW005ViewRs> {
  return fetchFace<FaceTW005ViewRs>({
    endpoint: "/private/face/tw005/{faceId}/v1",
    twinId,
    faceId,
    query: {
      showFaceTW005Button2TransitionMode: "DETAILED",
      showFaceTwidget2TwinMode: "DETAILED",
    },
  });
}

export async function fetchTC001Face(
  faceId: string,
  twinId: string
): Promise<FaceTC001ViewRs> {
  return fetchFace<FaceTC001ViewRs>({
    endpoint: "/private/face/tc001/{faceId}/v1",
    twinId,
    faceId,
    query: {
      showFaceTC0012TwinClassFieldMode: "DETAILED",
      showFaceTC0012TwinClassMode: "DETAILED",
      showTwinClass2TwinClassFieldMode: "DETAILED",
      showTwinClassFieldDescriptor2DataListOptionMode: "DETAILED",
    },
  });
}
