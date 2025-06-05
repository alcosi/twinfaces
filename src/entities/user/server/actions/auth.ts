"use server";

import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

import { TwinsAPI } from "@/shared/api";
import { isPopulatedArray, isUndefined, safe } from "@/shared/libs";

import { hydrateDomainUserFromMap } from "../../libs/helpers";
import {
  CONFIRM_AUTH_FORM_SCHEMA,
  LOGIN_AUTH_FORM_SCHEMA,
  REGISTER_AUTH_PAYLOAD_SCHEMA,
  STUB_AUTH_FORM_SCHEMA,
} from "../libs";
import {
  AuthConfig,
  AuthConfirmRs,
  AuthLoginRs,
  AuthRegisterRs,
} from "../types";

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

export async function loginAuthAction(
  _: unknown,
  formData: FormData
): Promise<AuthLoginRs> {
  const { domainId, username, password } = LOGIN_AUTH_FORM_SCHEMA.parse({
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

export async function registerAuthAction(
  _: unknown,
  formData: FormData
): Promise<AuthRegisterRs> {
  const { domainId, firstName, email, password } =
    REGISTER_AUTH_PAYLOAD_SCHEMA.parse({
      domainId: formData.get("domainId"),
      firstName: formData.get("firstName"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

  try {
    const { data, error } = await TwinsAPI.POST(
      "/auth/signup_by_email/initiate/v1",
      {
        body: { firstName, email, password },
        params: { header: { DomainId: domainId, Channel: "WEB" } },
      }
    );

    if (error) {
      console.error("Register error response:", error);
      const message = error.statusDetails ?? `${error.status}: ${error.msg}`;
      throw new Error(message);
    }

    return data;
  } catch (err) {
    console.error("Register request failed:", err);
    const message =
      err instanceof Error
        ? err.message
        : "An unknown error occured during register";
    throw new Error(message);
  }
}

export async function confirmAuthAction(
  _: unknown,
  formData: FormData
): Promise<AuthConfirmRs> {
  const { domainId, verificationToken } = CONFIRM_AUTH_FORM_SCHEMA.parse({
    domainId: formData.get("domainId"),
    verificationToken: formData.get("verificationToken"),
  });

  try {
    const { data, error } = await TwinsAPI.POST(
      "/auth/signup_by_email/confirm/v1",
      {
        params: {
          header: {
            DomainId: domainId,
            Channel: "WEB",
          },
          query: {
            verificationToken,
          },
        },
      }
    );

    if (error) {
      console.error("Confirm error response:", error);
      const message = error.statusDetails ?? `${error.status}: ${error.msg}`;
      throw new Error(message);
    }

    return data;
  } catch (err) {
    console.error("Confirm request failed:", err);
    const message =
      err instanceof Error
        ? err.message
        : "An unknown error occured during confirm";
    throw new Error(message);
  }
}
