import { FeaturerTypeId } from "@/entities/featurer";

export type FeaturerFieldProps = {
  typeId: FeaturerTypeId;
  paramsFieldName: string;
  // Misc
  selectPlaceholder?: string;
  searchPlaceholder?: string;
  noItemsText?: string;
};
