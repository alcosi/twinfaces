import { create } from "zustand";

import { clientCookies } from "@/shared/libs";

import type { DomainUser_DETAILED } from "../../entities/user";

export interface AuthUser {
  domainUser?: Partial<DomainUser_DETAILED>;
  authToken?: string;
  domainId?: string;
}

interface AuthUserStore {
  authUser: AuthUser | null;
  setAuthUser: (user: AuthUser | null) => void;
  updateUser: (updatedFields: Partial<AuthUser>) => void;
  logout: () => void;
}

export const useAuthUserStore = create<AuthUserStore>((set) => ({
  authUser: null,
  initialized: false,

  setAuthUser: (user) => {
    set({ authUser: user });

    if (user?.authToken) {
      clientCookies.set("authToken", user.authToken, { path: "/" });
    } else {
      clientCookies.remove("authToken");
    }

    if (user?.domainId) {
      clientCookies.set("domainId", user.domainId, { path: "/" });
    } else {
      clientCookies.remove("domainId");
    }

    if (user?.domainUser?.userId) {
      clientCookies.set("userId", user.domainUser.userId, { path: "/" });
    } else {
      clientCookies.remove("userId");
    }
  },

  updateUser: (updatedFields) =>
    set((state) => ({
      authUser: {
        ...state.authUser,
        ...updatedFields,
      },
    })),

  logout: () => {
    set({ authUser: null });
    clientCookies.remove("authToken");
    clientCookies.remove("domainId");
    clientCookies.remove("userId");
  },
}));
