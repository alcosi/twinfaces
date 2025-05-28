"use server";

import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

import { TwinsAPI } from "@/shared/api";
import { isPopulatedArray, isUndefined, safe } from "@/shared/libs";

import { hydrateDomainUserFromMap } from "../../libs/helpers";
import {
  EMAIL_PASSWORD_AUTH_FORM_SCHEMA,
  STUB_AUTH_FORM_SCHEMA,
} from "../libs";
import { AuthConfig, AuthLoginRs } from "../types";

export async function fetchAuthConfig(domainId: string): Promise<AuthConfig> {
  const result = await safe(() =>
    TwinsAPI.POST("/auth/config/v1", {
      params: {
        header: {
          DomainId: domainId,
          Channel: "WEB",
        },
      },
    })
  );

  if (!result.ok) {
    notFound();
  }

  if (result.data.error) {
    throw new Error(result.data.error.msg);
  }

  if (isUndefined(result.data.data.config)) {
    throw new Error("Config is not returned");
  }

  return result.data.data.config;
}

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

export async function emailPasswordAuthAction(
  _: unknown,
  formData: FormData
): Promise<AuthLoginRs> {
  const { domainId, username, password } =
    EMAIL_PASSWORD_AUTH_FORM_SCHEMA.parse({
      domainId: formData.get("domainId"),
      username: formData.get("username"),
      password: formData.get("password"),
    });

  try {
    const { data, error } = await TwinsAPI.POST("/auth/login/v1", {
      body: { username, password },
      params: { header: { DomainId: domainId, Channel: "WEB" } },
    });

    if (error) {
      console.error("Login error response:", error);
      const message = error.statusDetails ?? `${error.status}: ${error.msg}`;
      throw new Error(message);
    }

    return data;
  } catch (err) {
    console.error("Login request failed:", err);
    const message =
      err instanceof Error
        ? err.message
        : "An unknown error occurred during login";
    throw new Error(message);
  }
}
