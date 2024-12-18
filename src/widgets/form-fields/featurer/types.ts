import { FeaturerTypeId, FeaturerValue } from "@/entities/featurer";

export interface FeaturerInputProps {
  typeId: FeaturerTypeId;
  defaultId?: number;
  defaultParams?: object;
  onChange?: (value: FeaturerValue | null) => any;
  buttonClassName?: string;
  selectPlaceholder?: string;
  searchPlaceholder?: string;
  noItemsText?: string;
}
