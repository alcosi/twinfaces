import { useCallback, useContext, useState } from "react";

import { PrivateApiContext } from "@/shared/api";
import { clientCookies } from "@/shared/libs";

import { AuthRefreshRsV1 } from "../types";

export const useFetchUserByAuthToken = () => {
  const api = useContext(PrivateApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUserByAuthToken =
    useCallback(async (): Promise<AuthRefreshRsV1> => {
      setLoading(true);

      const refreshToken = clientCookies.get("refresh_token") ?? "";
      try {
        const { data, error } = await api.user.getByRefreshToken({
          refreshToken,
        });

        if (error) {
          throw new Error(
            "Failed to fetch refresh token due to API error",
            error
          );
        }

        return data;
      } finally {
        setLoading(false);
      }
    }, [api]);

  return { fetchUserByAuthToken, loading };
};
