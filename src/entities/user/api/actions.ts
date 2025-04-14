"use server";

import { revalidatePath } from "next/cache";

import { TwinsAPI } from "@/shared/api";
import { isPopulatedArray } from "@/shared/libs";

import { hydrateDomainUserFromMap } from "../libs/helpers";
import { LOGIN_FORM_SCHEMA } from "../libs/schemas";

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

export async function loginFormAction(_: unknown, formData: FormData) {
  const { userId, domainId, businessAccountId } = LOGIN_FORM_SCHEMA.parse({
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
