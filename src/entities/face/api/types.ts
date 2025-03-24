import { components } from "@/shared/api/generated/schema";

// type FaceVariants = "nb001" | "pg001" | "wt001";

export type Face = components["schemas"]["FaceV1"];

export type FaceNB001 = components["schemas"]["FaceNB001v1"];
export type FaceNB001MenuItem = components["schemas"]["FaceNB001MenuItemV1"];

export type FacePG001 = components["schemas"]["FacePG001v1"];
export type FacePG001Widget = components["schemas"]["FacePG001WidgetV1"];

export type FaceWT001 = components["schemas"]["FaceWT001v1"];
