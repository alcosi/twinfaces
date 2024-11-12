import { useFetchTwinClassById } from "@/entities/twinClass/libs";
import { TwinClassStatus } from "@/entities/twinClassStatus/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useClassStatuses({ twinClassId }: { twinClassId: string }) {
  const { fetchTwinClassById } = useFetchTwinClassById();
  const [statuses, setStatuses] = useState<TwinClassStatus[]>([]);

  useEffect(() => {
    fetchStatuses();
  }, [twinClassId]);

  async function fetchStatuses() {
    const response = await fetchTwinClassById({
      id: twinClassId,
      query: {
        showTwinClassMode: "SHORT",
        // showTwin2TwinClassMode: 'SHORT',
        // showTwin2StatusMode: 'SHORT',
        showTwinClass2StatusMode: "DETAILED",
      },
    });

    const data = response.data;
    if (!data || data.status != 0) {
      console.error("failed to fetch twin class fields", data);
      let message = "Failed to load twin class fields";
      if (data?.msg) message += `: ${data.msg}`;
      toast.error(message);
      return { data: [], pageCount: 0 };
    }

    const values = Object.values(data.twinClass?.statusMap ?? {});
    setStatuses(values);
  }

  async function getStatusesBySearch(search: string) {
    return statuses.filter(
      (status) =>
        (status.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (status.key ?? "").toLowerCase().includes(search.toLowerCase())
    );
  }

  async function findStatusById(id: string) {
    console.log("findStatusById", id, statuses);
    return statuses.find((x) => x.id === id);
  }

  return { statuses, getStatusesBySearch, findStatusById, fetchStatuses };
}
