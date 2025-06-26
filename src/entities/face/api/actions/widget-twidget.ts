"use server";

import { TwinsAPI } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { getAuthHeaders } from "../../libs";
import {
  FaceTC001ViewRs,
  FaceTW001,
  FaceTW002,
  FaceTW004,
  FaceTW005,
  FaceWT001ViewRs,
  FaceWT003,
} from "../types";

type FetchFaceOptions<T> = {
  faceId: string;
  twinId?: string;
  endpoint:
    | "/private/face/wt001/{faceId}/v1"
    | "/private/face/wt003/{faceId}/v1"
    | "/private/face/tw001/{faceId}/v1"
    | "/private/face/tw002/{faceId}/v1"
    | "/private/face/tw004/{faceId}/v1"
    | "/private/face/tw005/{faceId}/v1"
    | "/private/face/tc001/{faceId}/v1";
  query: Record<string, any>;
  extract: (data: any) => T | undefined;
};

async function fetchFace<T>({
  twinId,
  faceId,
  endpoint,
  query,
  extract,
}: FetchFaceOptions<T>): Promise<T> {
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

  const extracted = extract(data);

  if (isUndefined(extracted)) {
    const message = `[${endpoint}] Widget not found for faceId=${faceId}, twinId=${twinId}`;
    console.warn(message);
    throw new Error(message);
  }

  return extracted;
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
    },
    extract: (data) => data,
  });
}

export async function fetchWT003Face(
  faceId: string,
  twinId?: string
): Promise<FaceWT003> {
  return fetchFace<FaceWT003>({
    faceId,
    endpoint: "/private/face/wt003/{faceId}/v1",
    twinId,
    query: {},
    extract: (data) => data?.widget,
  });
}

export async function fetchTW001Face(
  faceId: string,
  twinId: string
): Promise<FaceTW001> {
  return fetchFace<FaceTW001>({
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
    extract: (data) => data?.widget,
  });
}

export async function fetchTW002Face(
  faceId: string,
  twinId: string
): Promise<FaceTW002> {
  return fetchFace<FaceTW002>({
    endpoint: "/private/face/tw002/{faceId}/v1",
    twinId,
    faceId,
    query: {},
    extract: (data) => data?.widget,
  });
}

export async function fetchTW004Face(
  faceId: string,
  twinId: string
): Promise<FaceTW004> {
  return fetchFace<FaceTW004>({
    endpoint: "/private/face/tw004/{faceId}/v1",
    twinId,
    faceId,
    query: {
      showFaceTW0042TwinClassFieldMode: "SHORT",
      showFaceTwidget2TwinMode: "DETAILED",
    },
    extract: (data) => data?.widget,
  });
}

export async function fetchTW005Face(
  faceId: string,
  twinId: string
): Promise<FaceTW005> {
  return fetchFace<FaceTW005>({
    endpoint: "/private/face/tw005/{faceId}/v1",
    twinId,
    faceId,
    query: {
      showFaceTW005Button2TransitionMode: "DETAILED",
      showFaceTwidget2TwinMode: "DETAILED",
    },
    extract: (data) => data?.widget,
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
    extract: (data) => data,
  });
}
