"use server";

import { cookies } from "next/headers";

import { AuthUser } from "./types";

export async function setAuthUser(user?: AuthUser) {
  return cookies().then((store) => {
    if (user) {
      store.set("userId", `${user.userId}`, { path: "/" });
      store.set("authToken", `${user?.authToken}`, { path: "/" });
      store.set("domainId", `${user?.domainId}`, { path: "/" });
    }
  });
}
