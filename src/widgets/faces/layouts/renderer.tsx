import { Face_DETAILED, fetchFaceById } from "@/entities/face";
import { safe } from "@/shared/libs";

import { UnderConstruction } from "../../under-construction";
import { AlertError } from "../components";
import { PGFaceProps } from "./types";
import { PG001, PG002 } from "./views";

const LAYOUT_MAP = {
  PG001,
  PG002,
} as const;

export async function LayoutRenderer(props: PGFaceProps) {
  if (!props || !props.pageFaceId) {
    return <UnderConstruction />;
  }

  const result = await safe(() =>
    fetchFaceById<Face_DETAILED>(props.pageFaceId, {
      query: { showFaceMode: "DETAILED" },
    })
  );

  if (!result.ok) {
    return <AlertError message="Widget not found or inaccessible." />;
  }

  const pageFace = result.data;
  const componentName = pageFace.component;
  const Component = LAYOUT_MAP[componentName as keyof typeof LAYOUT_MAP];

  if (!Component) {
    return (
      <AlertError
        title="Unsupported page"
        message={`Page "${pageFace.name}" of component "${pageFace.component}"  is not supported.`}
        className="mt-4"
      />
    );
  }

  return <Component {...props} />;
}
