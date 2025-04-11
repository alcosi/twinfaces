"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { TwinsAPI } from "@/shared/api";
import { isPopulatedArray } from "@/shared/libs/types/checkers";

import { hydrateDomainUserFromMap } from "../libs/helpers";

async function login(authToken: string, domainId: string) {
  const { data, error } = await TwinsAPI.POST(
    "/private/domain/user/search/v1",
    {
      params: {
        header: {
          DomainId: domainId,
          AuthToken: authToken,
          Channel: "WEB",
        },
        query: {
          lazyRelation: false,
          showDomainUser2UserMode: "DETAILED",
          showDomainUserMode: "DETAILED",
          offset: 0,
          limit: 1,
          sortAsc: false,
        },
      },
      body: {
        userIdList: [authToken],
        businessAccountIdList: [],
      },
    }
  );

  if (error) {
    throw error;
  }

  return data;
}

const FORM_SCHEMA = z.object({
  domainId: z.string().uuid("Domain ID must be a valid UUID"),
  userId: z.string().uuid("Please enter a valid UUID"),
  businessAccountId: z
    .string()
    .uuid("Please enter a valid UUID")
    .optional()
    .or(z.literal("")),
});
export async function loginFormAction(_: unknown, formData: FormData) {
  const { userId, domainId, businessAccountId } = FORM_SCHEMA.parse({
    userId: formData.get("userId"),
    domainId: formData.get("domainId"),
    businessAccountId: formData.get("businessAccountId"),
  });

  const authToken = [userId, businessAccountId].filter(Boolean).join(",");
  const { users, relatedObjects } = await login(authToken, domainId);

  const index = users?.findIndex((user) => user.userId === userId) ?? -1;
  if (isPopulatedArray(users) && index !== -1) {
    const hydratedDomainUser = hydrateDomainUserFromMap(
      users[index]!,
      relatedObjects
    );

    revalidatePath("/");
    return {
      domainUser: hydratedDomainUser,
      authToken,
      domainId,
    };
  }
}
