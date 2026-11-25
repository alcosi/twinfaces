"use server";

import { apiFromRequest } from "@/entities/user/server";
import { isUndefined } from "@/shared/libs";

import { getAuthHeaders } from "../../libs";
import {
  FaceBC001ViewRs,
  FaceTC001ViewRs,
  FaceWT001ViewRs,
  FaceWT002ViewRs,
  FaceWT003ViewRs,
  FaceWT004ViewRs,
  FaceWT005ViewRs,
  FaceWT006ViewRs,
  FaceWT007ViewRs,
  FaceWT008ViewRs,
  FaceWT010ViewRs,
} from "../types";

type FetchFaceOptions = {
  faceId: string;
  // Required by every face component endpoint (TWINS-943).
  twinId: string;
  endpoint:
    | "/private/face/wt001/{faceId}/v1"
    | "/private/face/wt002/{faceId}/v1"
    | "/private/face/wt003/{faceId}/v1"
    | "/private/face/wt004/{faceId}/v1"
    | "/private/face/wt005/{faceId}/v1"
    | "/private/face/wt006/{faceId}/v2"
    | "/private/face/wt007/{faceId}/v1"
    | "/private/face/wt008/{faceId}/v1"
    | "/private/face/wt010/{faceId}/v1"
    | "/private/face/tc001/{faceId}/v1"
    | "/private/face/bc001/{faceId}/v1";
  query: Record<string, string>;
};

async function fetchFace<T>({
  twinId,
  faceId,
  endpoint,
  query,
}: FetchFaceOptions): Promise<T> {
  const headers = await getAuthHeaders();
  const api = await apiFromRequest();

  const { data } = await api.GET(endpoint, {
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
  twinId: string
): Promise<FaceWT001ViewRs> {
  return fetchFace<FaceWT001ViewRs>({
    faceId,
    endpoint: "/private/face/wt001/{faceId}/v1",
    twinId,
    query: {
      showModalFace2FaceMode: "DETAILED",
    },
  });
}

export async function fetchWT002Face(
  faceId: string,
  twinId: string
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
  twinId: string
): Promise<FaceWT003ViewRs> {
  return fetchFace<FaceWT003ViewRs>({
    faceId,
    endpoint: "/private/face/wt003/{faceId}/v1",
    twinId,
    query: {},
  });
}

export async function fetchWT004Face(
  faceId: string,
  twinId: string
): Promise<FaceWT004ViewRs> {
  return fetchFace<FaceWT004ViewRs>({
    endpoint: "/private/face/wt004/{faceId}/v1",
    twinId,
    faceId,
    query: {
      showFaceWT0042TwinClassFieldMode: "DETAILED",
      showFaceWidget2TwinMode: "DETAILED",
      showAttachment2TwinMode: "DETAILED",
      showTwin2AttachmentCollectionMode: "ALL",
      showTwin2AttachmentMode: "DETAILED",
    },
  });
}

export async function fetchWT005Face(
  faceId: string,
  twinId: string
): Promise<FaceWT005ViewRs> {
  return fetchFace<FaceWT005ViewRs>({
    endpoint: "/private/face/wt005/{faceId}/v1",
    twinId,
    faceId,
    query: {},
  });
}

export async function fetchWT006Face(
  faceId: string,
  twinId: string
): Promise<FaceWT006ViewRs> {
  return fetchFace<FaceWT006ViewRs>({
    endpoint: "/private/face/wt006/{faceId}/v2",
    twinId,
    faceId,
    query: {
      showFaceWT0062TwinClassFieldMode: "SHORT",
      showFaceWidget2TwinMode: "DETAILED",
    },
  });
}

export async function fetchWT007Face(
  faceId: string,
  twinId: string
): Promise<FaceWT007ViewRs> {
  return fetchFace<FaceWT007ViewRs>({
    endpoint: "/private/face/wt007/{faceId}/v1",
    twinId,
    faceId,
    query: {
      showFaceWT007Button2TransitionMode: "DETAILED",
      showFaceWidget2TwinMode: "DETAILED",
    },
  });
}

export async function fetchWT008Face(
  faceId: string,
  twinId: string
): Promise<FaceWT008ViewRs> {
  return fetchFace<FaceWT008ViewRs>({
    endpoint: "/private/face/wt008/{faceId}/v1",
    twinId,
    faceId,
    // The pointed twin and its actions decide whether a comment can be added.
    query: {
      showFaceWidget2TwinMode: "DETAILED",
      showTwinActionMode: "SHOW",
    },
  });
}

export async function fetchWT010Face(
  faceId: string,
  twinId: string
): Promise<FaceWT010ViewRs> {
  return fetchFace<FaceWT010ViewRs>({
    endpoint: "/private/face/wt010/{faceId}/v1",
    twinId,
    faceId,
    query: {},
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
      showTwinClassFieldCollectionMode: "SHOW",
      showTwinClassFieldDescriptor2DataListOptionMode: "DETAILED",
    },
  });
}

export async function fetchBC001Face(
  faceId: string,
  twinId: string
): Promise<FaceBC001ViewRs> {
  return fetchFace<FaceBC001ViewRs>({
    faceId,
    endpoint: "/private/face/bc001/{faceId}/v1",
    twinId,
    query: {},
  });
}
