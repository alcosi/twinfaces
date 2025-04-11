"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useCallback, useContext } from "react";
import { ZodType, z } from "zod";

import { AutoFormValueType } from "@/components/auto-field";

import { TwinClassField } from "@/entities/twin-class-field";
import { TwinUpdateRq } from "@/entities/twin/server";
import { PrivateApiContext } from "@/shared/api";
import { isPopulatedString } from "@/shared/libs";

import { InPlaceEdit, InPlaceEditProps } from "../../inPlaceEdit";

type FieldProps = {
  key: string;
  value: string;
  descriptor: TwinClassField["descriptor"];
};

type Props = {
  id: string;
  twinId: string;
  label?: ReactNode;
  field: FieldProps;
  schema?: ZodType;
  onSuccess?: () => void;
};

export function TwinFieldEditor({
  id,
  twinId,
  label,
  field,
  schema,
  onSuccess,
}: Props) {
  const api = useContext(PrivateApiContext);
  const router = useRouter();

  const updateTwin = useCallback(
    async (body: TwinUpdateRq) => {
      try {
        await api.twin.update({ id: twinId, body });
        onSuccess?.() || router.refresh();
      } catch (error) {
        console.error("Failed to update twin:", error);
        throw error;
      }
    },
    [api.twin, twinId, router, onSuccess]
  );

  const editProps: InPlaceEditProps<string> = {
    id,
    value: field.value,
    valueInfo: {
      type: AutoFormValueType.twinField,
      label: undefined,
      descriptor: field.descriptor,
      twinId,
    },
    schema: schema ?? z.string().min(1),
    onSubmit: (value) =>
      updateTwin({
        [field.key]: value,
      }),
  };

  return (
    <div className="space-y-0.5">
      {label &&
        (isPopulatedString(label) ? (
          <label className="px-3 text-sm font-bold">{label}</label>
        ) : (
          label
        ))}
      <InPlaceEdit {...editProps} />
    </div>
  );
}
