import { FacePG001, fetchPageFace } from "@/entities/face";
import { isPopulatedArray } from "@/shared/libs";

import { WT001Face } from "../wt001";

export async function PG001Face({ pageFaceId }: { pageFaceId: string }) {
  const pageFace: FacePG001 = await fetchPageFace(pageFaceId);

  return (
    <main className="">
      {isPopulatedArray(pageFace.widgets) &&
        pageFace.widgets.map((widget) => (
          <WT001Face key={widget.id} widgetFaceId={widget.widgetFaceId!} />
        ))}
    </main>
  );
}
