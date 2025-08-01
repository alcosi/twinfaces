import { getAuthHeaders } from "@/entities/face";
import { RelatedObjects, TwinsAPI } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { hydrateTwinFromMap } from "../libs";
import { TwinAttachmentCreateRq, TwinViewQuery, Twin_HYDRATED } from "./types";

export async function fetchTwinById<T extends Twin_HYDRATED>(
  twinId: string,
  options: {
    header: {
      DomainId: string;
      AuthToken: string;
      Channel: "WEB";
    };
    query?: TwinViewQuery;
  }
): Promise<{ twin: T; relatedObjects: RelatedObjects }> {
  const { data, error } = await TwinsAPI.GET("/private/twin/{twinId}/v2", {
    params: {
      header: options.header,
      path: { twinId },
      query: {
        lazyRelation: false,
        ...options.query,
      },
    },
  });

  if (error) {
    throw new Error("Failed to fetch twin due to API error", error);
  }

  if (isUndefined(data.twin)) {
    throw new Error("Invalid response data while fetching twin", error);
  }

  const relatedObjects = data.relatedObjects ?? {};

  const hydratedTwin = data.relatedObjects
    ? hydrateTwinFromMap<T>(data.twin, relatedObjects)
    : (data.twin as T);

  return {
    twin: hydratedTwin,
    relatedObjects,
  };
}

export async function uploadTwinAttachment(twinId: string, file: File) {
  const header = await getAuthHeaders();

  const formData = new FormData();

  formData.append("file", file, file.name);

  const payload = {
    attachments: [
      {
        twinId,
        storageLink: "multipart://file",
        title: file.name,
        size: file.size,
        description: "User uploaded image",
      },
    ],
  };

  formData.append("request", JSON.stringify(payload));

  const { data, error } = await TwinsAPI.POST(
    "/private/twin/{twinId}/attachment/v1",
    {
      params: {
        header,
        path: { twinId },
      },
      body: formData as TwinAttachmentCreateRq,
    }
  );

  if (error) {
    throw new Error("Upload twin attachment is failed!");
  }

  return data;
}
