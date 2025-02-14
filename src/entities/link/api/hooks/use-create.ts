import { useCallback, useContext } from "react"
import { z } from "zod"
import { LINK_SCHEMA } from "../../libs"
import { ApiContext } from "@/shared/api"
import { toast } from "sonner"
import { CreateLinkRequestBody } from "../types"

export const useCreateLink = () => {
  const api = useContext(ApiContext);

  const createLink = useCallback(
    async (formValues: z.infer<typeof LINK_SCHEMA>) => {
      const body: CreateLinkRequestBody = {
            forwardNameI18n: {
              translations: {
                en: formValues.name,
              },
            },
            backwardNameI18n: {
              translations: {
                en: formValues.name,
              },
            },
            ...formValues,
          };

          const { error } = await api.link.create({ body });
          if (error) {
            throw error;
          }
          toast.success("Link created successfully!");
    }, []
  )

  return { createLink };
}