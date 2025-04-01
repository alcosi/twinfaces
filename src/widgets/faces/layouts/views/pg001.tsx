import { fetchPG001Face } from "@/entities/face";
import { cn, isPopulatedArray, safe } from "@/shared/libs";

import { AlertError } from "../../alert-error";
import { PGLayoutStyleMap } from "../constants";
import { PGFaceProps } from "../types";
import { mapWidgetsToNodes } from "../utils";

export async function PG001({ pageFaceId, twinId }: PGFaceProps) {
  const pageResult = await safe(() => fetchPG001Face(pageFaceId));

  if (!pageResult.ok) {
    return (
      <AlertError message="Failed to load PG001 layout. Try again later" />
    );
  }

  const pageFace = pageResult.data;

  const layoutVariant = PGLayoutStyleMap[pageFace.layout ?? "ONE_COLUMN"];

  return (
    <main className={cn("py-4", layoutVariant)}>
      {isPopulatedArray(pageFace.widgets) &&
        mapWidgetsToNodes(pageFace.widgets, twinId)}
    </main>
  );
}
