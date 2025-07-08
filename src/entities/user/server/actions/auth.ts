"use server";

import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

import { isAuthUserGranted } from "@/entities/user/server";
import { TwinsAPI } from "@/shared/api";
import { isApiErrorResponse } from "@/shared/api/utils";
import {
  isPopulatedArray,
  isUndefined,
  printAndReturnApiErrorResponse,
} from "@/shared/libs";

import { DomainUser_DETAILED } from "../../api";
import { hydrateDomainUserFromMap } from "../../libs/helpers";
import {
  EMAIL_PASSWORD_SIGN_IN_SCHEMA,
  EMAIL_PASSWORD_SIGN_UP_PAYLOAD_SCHEMA,
  EMAIL_VERIFICATION_FORM_SCHEMA,
  STUB_AUTH_FORM_SCHEMA,
} from "../libs";
import {
  AuthConfig,
  AuthLoginRs,
  AuthSignUpVerificationByEmailRs,
  AuthSignupByEmailRs,
} from "../types";

export async function fetchAuthConfig(domainId: string): Promise<AuthConfig> {
  const result = await TwinsAPI.POST("/auth/config/v1", {
    params: {
      header: {
        DomainId: domainId,
        Channel: "WEB",
      },
    },
  });

  if (result.error) {
    throw result.error;
  }

  if (isUndefined(result.data.config)) {
    throw new Error("Config is not returned");
  }

  return result.data.config;
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

export async function getAuthenticatedUser({
  domainId,
  authToken,
}: {
  domainId: string;
  authToken: string;
}) {
  const { data, error } = await TwinsAPI.GET("/private/domain/user/v1", {
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
      },
    },
  });

  if (error) {
    throw error;
  }

  const hydratedDomainUser = hydrateDomainUserFromMap(
    data.user as DomainUser_DETAILED,
    data.relatedObjects
  );

  return hydratedDomainUser;
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
  const { domainId, username, password } = EMAIL_PASSWORD_SIGN_IN_SCHEMA.parse({
    domainId: formData.get("domainId"),
    username: formData.get("username"),
    password: formData.get("password"),
  });

  const { data, error } = await TwinsAPI.POST("/auth/login/v1", {
    body: { username, password },
    params: { header: { DomainId: domainId, Channel: "WEB" } },
  });

  if (error) {
    return error;
  }

  return data;
}

export async function signUpAuthAction(
  _: unknown,
  formData: FormData
): Promise<AuthSignupByEmailRs> {
  try {
    const { domainId, firstName, lastName, email, password } =
      EMAIL_PASSWORD_SIGN_UP_PAYLOAD_SCHEMA.parse({
        domainId: formData.get("domainId"),
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        password: formData.get("password"),
      });

    const { data, error } = await TwinsAPI.POST(
      "/auth/signup_by_email/initiate/v1",
      {
        body: { firstName, lastName, email, password },
        params: { header: { DomainId: domainId, Channel: "WEB" } },
      }
    );

    if (error) {
      return error;
    }

    return data;
  } catch (error) {
    const response = printAndReturnApiErrorResponse({
      error,
      requestName: "Signup",
    });

    if (isApiErrorResponse(response)) {
      return response;
    } else {
      throw error;
    }
  }
}

export async function verifyEmailAction(
  _: unknown,
  formData: FormData
): Promise<AuthSignUpVerificationByEmailRs> {
  const { domainId, verificationToken } = EMAIL_VERIFICATION_FORM_SCHEMA.parse({
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
      return error;
    }

    return data;
  } catch (error) {
    const response = printAndReturnApiErrorResponse({
      error,
      requestName: "Verify email",
    });

    if (isApiErrorResponse(response)) {
      return response;
    } else {
      throw error;
    }
  }
}

/**
 * Throws a 404 if the current user lacks any of the given permission IDs.
 */
export async function requirePermissionsOr404(permissionIds: string[]) {
  for (const permission of permissionIds) {
    const allowed = await isAuthUserGranted({
      permission,
    });
    if (!allowed) {
      notFound();
    }
  }
}
