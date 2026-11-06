import { PaginationState } from "@tanstack/table-core";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import {
  ResourceFilters,
  ResourceSortField,
  ResourceUploadResult,
} from "../libs";

export function createResourceApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
    sortField,
    sortDirection,
  }: {
    pagination: PaginationState;
    filters?: ResourceFilters;
    sortField?: ResourceSortField;
    sortDirection?: "ASC" | "DESC";
  }) {
    return settings.client.POST("/private/resource/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
        },
      },
      body: {
        search: {
          ...filters,
        },
        sortField,
        sortDirection,
      },
    });
  }

  /**
   * Uploads a single file as a domain resource. Uses XHR instead of the typed
   * client to report upload progress (openapi-fetch can't). Goes through the
   * same `/api/proxy` base as the typed client, which attaches the auth/domain
   * headers from cookies. The multipart field is `files` per the API contract.
   */
  function upload({
    file,
    onProgress,
  }: {
    file: File;
    onProgress?: (percent: number) => void;
  }): Promise<ResourceUploadResult[]> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("files", file, file.name);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/proxy/private/resource/upload/v1");
      xhr.responseType = "text";

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          onProgress?.(Math.round((event.loaded / event.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText) as {
              files?: ResourceUploadResult[];
            };
            resolve(data.files ?? []);
          } catch {
            resolve([]);
          }
          return;
        }

        reject(new Error(parseErrorText(xhr.status, xhr.responseText)));
      };

      xhr.onerror = () => reject(new Error("Network error during upload"));
      xhr.send(formData);
    });
  }

  return {
    search,
    upload,
  };
}

export type ResourceApi = ReturnType<typeof createResourceApi>;

/** Extracts a human-readable message from the platform error envelope. */
function parseErrorText(status: number, text: string): string {
  try {
    const parsed = JSON.parse(text) as { msg?: string; statusDetails?: string };
    return parsed.statusDetails || parsed.msg || `HTTP ${status}`;
  } catch {
    return text || `HTTP ${status}`;
  }
}
