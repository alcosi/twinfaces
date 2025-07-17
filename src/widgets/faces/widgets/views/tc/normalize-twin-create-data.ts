import { FaceTC001, FaceTC002 } from "@/entities/face";

import { TCFormField, TCSchemaMap, TCViewMap } from "./types";

type EffectiveTwinCreateData = {
  twinClassId?: string;
  fields: TCFormField[];
  showVariantSelector: boolean;
  variantOptions?: {
    id: string;
    label: string;
    twinClassId: string;
    fields: TCFormField[];
  }[];
};

function isFaceTC002(data: FaceTC001 | FaceTC002): data is FaceTC002 {
  return data.component === "TC002";
}

export function normalizeTwinCreateData(
  data: TCSchemaMap[keyof TCViewMap],
  selectedOptionId?: string
): EffectiveTwinCreateData {
  if (isFaceTC002(data)) {
    const options = data.options;
    const selected = options?.find((opt) => opt.id === selectedOptionId);
    return {
      twinClassId: selected?.twinClassId,
      fields: (selected?.fields ?? []) as TCFormField[],
      showVariantSelector: true,
      variantOptions: options?.map((opt) => ({
        id: opt.id!,
        label: opt.classSelectorLabel!,
        twinClassId: opt.twinClassId!,
        fields: opt.fields as TCFormField[],
      })),
    };
  }

  return {
    twinClassId: data?.twinClassId,
    fields: (data?.fields ?? []) as TCFormField[],
    showVariantSelector: false,
  };
}
