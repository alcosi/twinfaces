import { AutoFormValueType } from "@/components/auto-field";
import { z } from "zod";
import { PermissionApiFilterFields } from "../api";

// NOTE: is used only in one place
export const FILTERS: Record<PermissionApiFilterFields, any> = {
  idList: {
    type: AutoFormValueType.multiCombobox,
    label: "Id",
    multi: true,
  },
  keyLikeList: {
    type: AutoFormValueType.multiCombobox,
    label: "Key",
    multi: true,
  },
  nameLikeList: {
    type: AutoFormValueType.multiCombobox,
    label: "Name",
    multi: true,
  },
  descriptionLikeList: {
    type: AutoFormValueType.string,
    label: "Description",
  },
} as const;

export const PERMISSION_SCHEMA = z.object({
  groupId: z.string().uuid("Group ID must be a valid UUID"),
  key: z.string().min(1, "Key must not be empty"),
  name: z.string().min(1, "Name must not be empty"),
  description: z.string().optional(),
});
