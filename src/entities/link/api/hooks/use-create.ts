import { ApiContext } from "@/shared/api";
import { useCallback, useContext } from "react";
import { CreateLinkRequestBody } from "../types";

export const useCreateLink = () => {
  const api = useContext(ApiContext);

  const createLink = useCallback(async (body: CreateLinkRequestBody) => {
    const { error } = await api.link.create({ body });
    if (error) {
      throw error;
    }
  }, []);

  return { createLink };
};
