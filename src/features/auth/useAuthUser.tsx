import { useCallback, useEffect, useState } from "react";

import { DomainUser_DETAILED } from "@/entities/user";
import { useLocalStorage } from "@/shared/libs";

interface AuthUser {
  domainUser?: DomainUser_DETAILED;
  authToken: string;
  domainId: string;
}

interface UseAuthUser {
  authUser: AuthUser | null;
  setAuthUser: (user: AuthUser | null) => void;
  updateUser: (updatedFields: Partial<AuthUser>) => void;
  logout: () => void;
}

export function useAuthUser(): UseAuthUser {
  const [storedValue, setStoredValue] = useLocalStorage<AuthUser | null>(
    "auth-user",
    null
  );
  const [authUser, setAuthUserState] = useState<AuthUser | null>(storedValue);

  useEffect(() => {
    setAuthUserState(storedValue);
  }, [storedValue]);

  const setAuthUser = useCallback(
    (user: AuthUser | null) => {
      setStoredValue(user);
    },
    [setStoredValue]
  );

  const updateUser = useCallback(
    (updatedFields: Partial<AuthUser>) => {
      if (authUser) {
        const updatedUser = { ...authUser, ...updatedFields };
        setStoredValue(updatedUser);
      }
    },
    [authUser, setStoredValue]
  );

  const logout = useCallback(() => {
    setStoredValue(null);
  }, [setStoredValue]);

  return {
    authUser,
    setAuthUser,
    updateUser,
    logout,
  };
}
