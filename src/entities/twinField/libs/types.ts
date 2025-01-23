import { DataListOptionV3 } from "@/entities/datalist-option";
import { TwinClassField } from "@/entities/twinClassField";
import { RequireFields } from "@/shared/libs";

export type TwinFieldUI = RequireFields<
  TwinClassField,
  "id" | "key" | "name" | "description" | "required" | "descriptor"
> & {
  value: string | DataListOptionV3;
};

export enum TwinFieldType {
  // TWINFACES-435
  textV1 = "textV1",
  // TWINFACES-436
  urlV1 = "urlV1",
  // TWINFACES-434
  numericV1 = "numericV1",
  numericFieldV1 = "numericFieldV1",
  // TWINFACES-437
  colorHexV1 = "colorHexV1",
  // TWINFACES-438
  dateScrollV1 = "dateScrollV1",
  // TWINFACES-
  immutableV1 = "immutableV1",
  // TWINFACES-
  attachmentFieldV1 = "attachmentFieldV1",
  attachmentV1 = "attachmentV1",
  // TWINFACES-439
  selectLinkV1 = "selectLinkV1",
  // TWINFACES-440
  selectLinkLongV1 = "selectLinkLongV1",
  // TWINFACES-442
  selectListV1 = "selectListV1",
  // TWINFACES-443
  selectListLongV1 = "selectListLongV1",
  selectLongV1 = "selectLongV1",
  // TWINFACES-
  selectSharedInHeadV1 = "selectSharedInHeadV1",
  // TWINFACES-
  selectUserV1 = "selectUserV1",
  // TWINFACES-
  selectUserLongV1 = "selectUserLongV1",
}
