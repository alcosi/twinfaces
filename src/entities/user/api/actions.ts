"use server";

import { revalidatePath } from "next/cache";

import { TwinsAPI } from "@/shared/api";
import { isPopulatedArray } from "@/shared/libs";

import { hydrateDomainUserFromMap } from "../libs/helpers";
import { LOGIN_FORM_SCHEMA } from "../server";

async function login({
  userId,
  domainId,
  businessAccountId,
}: {
  userId: string;
  domainId: string;
  businessAccountId?: string;
}) {
  const authToken = [userId, businessAccountId].filter(Boolean).join(",");

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
        userIdList: [userId],
        businessAccountIdList: [],
      },
    }
  );

  if (error) {
    throw error;
  }

  return { authToken, ...data };
}

export async function loginFormAction(_: unknown, formData: FormData) {
  const { userId, domainId, businessAccountId } = LOGIN_FORM_SCHEMA.parse({
    userId: formData.get("userId"),
    domainId: formData.get("domainId"),
    businessAccountId: formData.get("businessAccountId"),
  });

  const { authToken, users, relatedObjects } = await login({
    userId,
    domainId,
    businessAccountId,
  });

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
