import { TwinStatusV2 } from "@/entities/twin-status";

export function filterDuplicateStatuses(
  statuses: TwinStatusV2[]
): TwinStatusV2[] {
  const seen = new Set();

  return statuses.filter((status) => {
    const name = status.name?.trim().toLowerCase();
    if (!name || seen.has(name)) return false;
    seen.add(name);
    return true;
  });
}
