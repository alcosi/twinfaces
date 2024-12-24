import { FeaturerTypeId, FeaturerValue } from "@/entities/featurer";

export interface FeaturerInputProps {
  typeId: FeaturerTypeId;
  onChange?: (value: FeaturerValue | null) => void;
  // Misc
  selectPlaceholder?: string;
  searchPlaceholder?: string;
  noItemsText?: string;
}
