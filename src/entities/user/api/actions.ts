"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { TwinsAPI } from "@/shared/api";
import { isPopulatedArray } from "@/shared/libs";

import { hydrateDomainUserFromMap } from "../libs/helpers";
import {
  EMAIL_PASSWORD_AUTH_FORM_SCHEMA,
  STUB_AUTH_FORM_SCHEMA,
} from "../server";

async function stubLogin({
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

export async function stubLoginFormAction(_: unknown, formData: FormData) {
  const { userId, domainId, businessAccountId } = STUB_AUTH_FORM_SCHEMA.parse({
    userId: formData.get("userId"),
    domainId: formData.get("domainId"),
    businessAccountId: formData.get("businessAccountId"),
  });

  const { authToken, users, relatedObjects } = await stubLogin({
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

export async function emailPasswordAuthAction(_: unknown, formData: FormData) {
  const { domainId, username, password } =
    EMAIL_PASSWORD_AUTH_FORM_SCHEMA.parse({
      domainId: formData.get("domainId"),
      username: formData.get("username"),
      password: formData.get("password"),
    });

  const { data, error } = await TwinsAPI.POST("/auth/login/v1", {
    body: { username, password },
    params: {
      header: {
        DomainId: domainId,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}
