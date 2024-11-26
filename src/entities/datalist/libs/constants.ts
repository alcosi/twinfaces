import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import { z } from "zod";
import { DatalistFilterKeys } from "../api/types";

export enum FilterFields {
  dataListIdList = "dataListIdList",
}

export const FILTERS: Record<DatalistFilterKeys, AutoFormValueInfo> = {
  dataListIdList: {
    type: AutoFormValueType.tag,
    label: "ID",
    schema: z.string().uuid("Please enter a valid UUID"),
    placeholder: "Enter UUID",
  },
} as const;
