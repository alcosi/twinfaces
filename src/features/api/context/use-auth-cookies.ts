import { useEffect, useState } from "react";

import { clientCookies } from "@/shared/libs";

export function useAuthCookies() {
  const [authToken, setAuthToken] = useState<string>();
  const [domainId, setDomainId] = useState<string>();
  const isReady = authToken !== undefined && domainId !== undefined;

  useEffect(() => {
    setAuthToken(clientCookies.get("authToken"));
    setDomainId(clientCookies.get("domainId"));
  }, []);

  return { authToken, domainId, isReady };
}
