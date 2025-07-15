import {
  FaceTC001,
  FaceTC002,
  FaceTCComponent,
  FaceTCComponentSchemaMap,
} from "@/entities/face";

import { Field } from "./tc-form";

type EffectiveTwinCreateData = {
  twinClassId?: string;
  fields: Field[];
  showVariantSelector: boolean;
  variantOptions?: {
    id: string;
    label: string;
    twinClassId: string;
    fields: Field[];
  }[];
};

function isFaceTC002(data: FaceTC001 | FaceTC002): data is FaceTC002 {
  return data.component === "TC002";
}

export function normalizeTwinCreateData(
  data: FaceTCComponentSchemaMap[FaceTCComponent],
  selectedOptionId?: string
): EffectiveTwinCreateData {
  if (isFaceTC002(data)) {
    const options = data.options;
    const selected = options?.find((opt) => opt.id === selectedOptionId);
    return {
      twinClassId: selected?.twinClassId,
      fields: (selected?.fields ?? []) as Field[],
      showVariantSelector: true,
      variantOptions: options?.map((opt) => ({
        id: opt.id!,
        label: opt.classSelectorLabel!,
        twinClassId: opt.twinClassId!,
        fields: opt.fields as Field[],
      })),
    };
  }

  return {
    twinClassId: data?.twinClassId,
    fields: (data?.fields ?? []) as Field[],
    showVariantSelector: false,
  };
}
