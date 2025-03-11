import { useCallback, useState } from "react";

import { useLocalStorage } from "@/shared/libs";

import { DomainViewPublic, useFetchDomainByKey } from "../../api";

export function usePublicDomainData() {
  const { fetchDomainByKey } = useFetchDomainByKey();
  const [storedDomainData, setStoredDomainData] =
    useLocalStorage<DomainViewPublic | null>("public-domain-data", null);
  const [publicDomainData, setPublicDomainData] =
    useState<DomainViewPublic | null>(storedDomainData);

  const fetchPublicDomainData = useCallback(
    async (domainKey: string) => {
      try {
        const data = await fetchDomainByKey(domainKey);

        if (data) {
          setPublicDomainData(data);
          setStoredDomainData(data);
        }
      } catch (error) {
        console.error(
          "An error occurred while fetching public domain data:",
          error
        );

        setPublicDomainData(null);
        setStoredDomainData(null);

        throw error;
      }
    },
    [fetchDomainByKey, setPublicDomainData]
  );

  return { publicDomainData, fetchPublicDomainData };
}
