import { useCallback } from "react";

export const useSubdomain = () => {
  const getSubdomain = useCallback((mockDomain?: string) => {
    const domain =
      mockDomain ||
      (typeof window !== "undefined" ? window.location.hostname : "");
    const urls = [
      "dev-cabinet-twinfaces.worknroll.pro",
      "dev-onshelves.esas.by",
    ];

    for (const url of urls) {
      if (domain.endsWith(url)) {
        const curDomain = domain.replace(`.${url}`, "");
        return curDomain.includes(".") ? curDomain.split(".")[0] : curDomain;
      }
    }
  }, []);

  return { getSubdomain };
};
