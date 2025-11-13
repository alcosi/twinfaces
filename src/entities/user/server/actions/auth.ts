"use server";

import { revalidatePath } from "next/cache";
import { cookies as nextCookies, headers as nextHeaders } from "next/headers";
import { notFound } from "next/navigation";
import { Client } from "openapi-fetch";

import { isAuthUserGranted } from "@/entities/user/server";
import { Result } from "@/shared/api";
import { createTwinsClient } from "@/shared/api";
import { paths } from "@/shared/api/generated/schema";
import { errorToResult, isPopulatedArray, isUndefined } from "@/shared/libs";

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

export async function apiFromRequest(): Promise<Client<paths>> {
  const h = await nextHeaders();
  const c = await nextCookies();

  const proto =
    h.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "production" ? "https" : "http");
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const origin = process.env.APP_URL ?? `${proto}://${host}`;

  const cookieHeader = ["authToken", "refreshToken", "domainId", "userId"]
    .map((n) => {
      const v = c.get(n)?.value;
      return v ? `${n}=${v}` : null;
    })
    .filter(Boolean)
    .join("; ");

  const fetchWithCookies: typeof fetch = (input, init) => {
    if (!cookieHeader) return fetch(input as any, init);

    const merged = new Headers(
      input instanceof Request ? input.headers : undefined
    );
    if (init?.headers) {
      for (const [k, v] of new Headers(init.headers).entries()) {
        merged.set(k, v);
      }
    }
    merged.set("cookie", cookieHeader);

    const nextInit: RequestInit & { duplex?: "half" } = {
      ...init,
      headers: merged,
    };

    if (
      !nextInit.duplex &&
      (nextInit.body || (input instanceof Request && input.body))
    ) {
      nextInit.duplex = "half";
    }

    const url = input instanceof Request ? input.url : (input as any);
    if (input instanceof Request) {
      if (!nextInit.method) nextInit.method = input.method;
      if (!nextInit.body) nextInit.body = input.body;
    }

    return fetch(url, nextInit);
  };

  return createTwinsClient(`${origin}/api/proxy`, fetchWithCookies);
}

export async function fetchAuthConfig(domainId: string): Promise<AuthConfig> {
  const api = await apiFromRequest();

  const result = await api.POST("/auth/config/v1", {
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
  const api = await apiFromRequest();
  const authToken = [userId, businessAccountId].filter(Boolean).join(",");

  const { data, error } = await api.POST("/private/domain/user/search/v1", {
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
  });

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
  const api = await apiFromRequest();

  const { data, error } = await api.GET("/private/domain/user/v1", {
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

  return hydrateDomainUserFromMap(
    data.user as DomainUser_DETAILED,
    data.relatedObjects
  );
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
): Promise<Result<AuthLoginRs>> {
  try {
    const { domainId, username, password } =
      EMAIL_PASSWORD_SIGN_IN_SCHEMA.parse({
        domainId: formData.get("domainId"),
        username: formData.get("username"),
        password: formData.get("password"),
      });
    const api = await apiFromRequest();

    const { data, error } = await api.POST("/auth/login/v1", {
      body: { username, password },
      params: { header: { DomainId: domainId, Channel: "WEB" } },
    });

    if (error) {
      return errorToResult(error);
    }

    return { ok: true, data };
  } catch (error) {
    return errorToResult(error);
  }
}

export async function signUpAuthAction(
  _: unknown,
  formData: FormData
): Promise<Result<AuthSignupByEmailRs>> {
  const api = await apiFromRequest();

  try {
    const { domainId, firstName, lastName, email, password } =
      EMAIL_PASSWORD_SIGN_UP_PAYLOAD_SCHEMA.parse({
        domainId: formData.get("domainId"),
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        password: formData.get("password"),
      });

    const { data, error } = await api.POST(
      "/auth/signup_by_email/initiate/v1",
      {
        body: { firstName, lastName, email, password },
        params: { header: { DomainId: domainId, Channel: "WEB" } },
      }
    );

    if (error) {
      return errorToResult(error);
    }

    return { ok: true, data };
  } catch (error) {
    return errorToResult(error);
  }
}

export async function verifyEmailAction(
  _: unknown,
  formData: FormData
): Promise<Result<AuthSignUpVerificationByEmailRs>> {
  const api = await apiFromRequest();

  const { domainId, verificationToken } = EMAIL_VERIFICATION_FORM_SCHEMA.parse({
    domainId: formData.get("domainId"),
    verificationToken: formData.get("verificationToken"),
  });

  try {
    const { data, error } = await api.POST("/auth/signup_by_email/confirm/v1", {
      params: {
        header: {
          DomainId: domainId,
          Channel: "WEB",
        },
        query: {
          verificationToken,
        },
      },
    });

    if (error) {
      return errorToResult(error);
    }

    if (isUndefined(data)) {
      return errorToResult(error);
    }

    return { ok: true, data };
  } catch (error) {
    return errorToResult(error);
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
