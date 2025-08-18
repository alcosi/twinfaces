import { getAuthHeaders } from "@/entities/face";
import { TwinsAPI } from "@/shared/api";
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
): Promise<T> {
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

  if (data.relatedObjects) {
    return hydrateTwinFromMap<T>(data.twin, data.relatedObjects);
  }

  return data.twin as T;
}

export async function uploadTwinAttachment(
  twinId: string,
  file: File,
  options: {
    imagesTwinClassFieldId?: string;
  }
) {
  const header = await getAuthHeaders();

  const formData = new FormData();

  formData.append("file", file, file.name);

  const payload = {
    attachments: [
      {
        storageLink: "multipart://file",
        title: file.name,
        size: file.size,
        description: "User uploaded image",
        twinClassFieldId: options.imagesTwinClassFieldId,
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

export async function updateTwinClassById(
  twinId: string,
  options: {
    header: {
      DomainId: string;
      AuthToken: string;
      Channel: "WEB";
    };
    newTwinClassId: string;
  }
) {
  const { data, error } = await TwinsAPI.PUT(
    "/private/twin/{twinId}/class_change/v1",
    {
      params: {
        header: options.header,
        path: { twinId },
      },
      body: { newTwinClassId: options.newTwinClassId },
    }
  );

  if (error) {
    throw new Error("Changing twin-class has failed!");
  }

  return data;
}
