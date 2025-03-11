import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { CreateLinkRequestBody } from "../types";

export const useCreateLink = () => {
  const api = useContext(PrivateApiContext);

  const createLink = useCallback(async (body: CreateLinkRequestBody) => {
    const { error } = await api.link.create({ body });
    if (error) {
      throw error;
    }
  }, []);

  return { createLink };
};
