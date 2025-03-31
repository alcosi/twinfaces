import { components, operations } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

// type FaceVariants = "nb001" | "pg001" | "wt001";

export type FaceViewQuery = operations["faceViewV1"]["parameters"]["query"];

export type Face = components["schemas"]["FaceV1"];
export type Face_SHORT = RequireFields<Face, "id" | "component">;
export type Face_DETAILED = RequireFields<
  Face_SHORT,
  "name" | "description" | "createdAt" | "createdByUserId"
>;

export type FaceNB001 = components["schemas"]["FaceNB001v1"];
export type FaceNB001MenuItem = components["schemas"]["FaceNB001MenuItemV1"];

export type FacePG001 = components["schemas"]["FacePG001v1"];
export type FacePG001Widget = components["schemas"]["FacePG001WidgetV1"];

export type FaceWT001 = components["schemas"]["FaceWT001v1"];

export type FaceTW001 = components["schemas"]["FaceTW001v1"];
export type FaceTW002 = components["schemas"]["FaceTW002v1"];
