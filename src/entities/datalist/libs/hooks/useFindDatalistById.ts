import { ApiContext } from "@/shared/api";
import { operations } from "@/shared/api/generated/schema";
import { useCallback, useContext } from "react";

export const useFetchDatalistById = () => {
  const api = useContext(ApiContext);

  const fetchDatalistById = useCallback(
    async ({
      id,
      query,
    }: {
      id: string;
      query: operations["dataListPublicViewV1"]["parameters"]["query"];
    }): Promise<ReturnType<typeof api.datalist.getById>> => {
      try {
        return await api.datalist.getById({
          id,
          query: query,
        });
      } catch (error) {
        console.error(`Failed to find datalist by ID: ${id}`, error);
        throw new Error(`Failed to find datalist with ID ${id}`);
      }
    },
    [api]
  );

  return { fetchDatalistById };
};

