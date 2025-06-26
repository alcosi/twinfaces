import { components, operations } from "@/shared/api/generated/schema";
import { Redefine, RequireFields } from "@/shared/libs";

// type FaceVariants = "nb001" | "pg001" | "wt001";

export type FaceViewQuery = operations["faceViewV1"]["parameters"]["query"];

export type Face = components["schemas"]["FaceV1"];
export type Face_SHORT = RequireFields<Face, "id" | "component">;
export type Face_DETAILED = RequireFields<
  Face_SHORT,
  "name" | "description" | "createdAt" | "createdByUserId"
>;

export type FaceNB001 = Redefine<
  components["schemas"]["FaceNB001v1"],
  {
    userAreaMenuItems?: FaceNB001MenuItem[];
  }
>;
export type FaceNB001MenuItem = Redefine<
  components["schemas"]["FaceNB001MenuItemV1"],
  {
    children?: FaceNB001MenuItem[];
  }
>;

export type FacePG001 = components["schemas"]["FacePG001v1"];
export type FacePG001Widget = components["schemas"]["FacePG001WidgetV1"];
export type FacePG002 = components["schemas"]["FacePG002v1"];
export type FacePG002Widget = components["schemas"]["FacePG002WidgetV1"];

export type FaceWT001 = components["schemas"]["FaceWT001v1"];
export type FaceWT002 = components["schemas"]["FaceWT002v1"];
export type FaceWT003 = components["schemas"]["FaceWT003DTOv1"];
export type FaceTW001 = components["schemas"]["FaceTW001v1"];
export type FaceTW002 = components["schemas"]["FaceTW002v1"];
export type FaceTW004 = components["schemas"]["FaceTW004v1"];
export type FaceTW005 = components["schemas"]["FaceWT005v1"];
export type FaceTC001 = components["schemas"]["FaceTC001v1"];

export type FaceWT002Button = components["schemas"]["FaceWT002ButtonV1"];

export type FaceTW005Button = components["schemas"]["FaceTW005ButtonV1"];

export type FaceWT001ViewRs = components["schemas"]["FaceWT001ViewRsV1"];
export type FaceWT002ViewRs = components["schemas"]["FaceWT002ViewRsV1"];
export type FaceWT003ViewRs = components["schemas"]["FaceWT003ViewRsV1"];
export type FaceTW001ViewRs = components["schemas"]["FaceTW001ViewRsV1"];
export type FaceTW002ViewRs = components["schemas"]["FaceTW002ViewRsV1"];
export type FaceTW004ViewRs = components["schemas"]["FaceTW004ViewRsV1"];
export type FaceTW005ViewRs = components["schemas"]["FaceWT005ViewRsV1"];
export type FaceTC001ViewRs = components["schemas"]["FaceTC001ViewRsV1"];
