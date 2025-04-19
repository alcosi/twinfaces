"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useCallback, useContext } from "react";
import { toast } from "sonner";
import { ZodType, z } from "zod";

import { AutoFormValueType } from "@/components/auto-field";

import { STATIC_TWIN_FIELD_KEYS, StaticTwinFieldKey } from "@/entities/twin";
import { TwinClassField } from "@/entities/twin-class-field";
import { Twin, TwinUpdateRq, hydrateTwinFromMap } from "@/entities/twin/server";
import { PrivateApiContext, RelatedObjects } from "@/shared/api";
import { isPopulatedString } from "@/shared/libs";

import { InPlaceEdit, InPlaceEditProps } from "../../../inPlaceEdit";
import { STATIC_FIELD_MAP } from "./constants";

type FieldProps = {
  id: string;
  key: StaticTwinFieldKey | string;
  value: string;
  descriptor: TwinClassField["descriptor"];
};

export type TwinFieldEditorProps = {
  id: string;
  twinId: string;
  twin: Twin;
  label?: ReactNode;
  field: FieldProps;
  schema?: ZodType;
  relatedObjects?: RelatedObjects;
  onSuccess?: () => void;
};

export function TwinFieldEditor({
  id,
  twinId,
  twin,
  label,
  field,
  schema,
  relatedObjects,
  onSuccess,
}: TwinFieldEditorProps) {
  const api = useContext(PrivateApiContext);
  const router = useRouter();

  const fieldRenderPreview = STATIC_FIELD_MAP[field.id]?.renderPreview;

  const hydratedTwin = hydrateTwinFromMap(twin, relatedObjects);

  function renderPreview(props?: { onTransitionPerformSuccess?: () => void }) {
    if (fieldRenderPreview) {
      return fieldRenderPreview(hydratedTwin, props);
    }

    const displayValue =
      relatedObjects?.dataListsOptionMap?.[field.value]?.name ?? field.value;

    return <span>{displayValue}</span>;
  }

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
    renderPreview: () => {
      return renderPreview({
        onTransitionPerformSuccess: handleOnTransitionPerformSuccess,
      });
    },
    schema: schema ?? z.string().min(1),
    onSubmit: async (value) => {
      const body: TwinUpdateRq = STATIC_TWIN_FIELD_KEYS.includes(
        field.key as StaticTwinFieldKey
      )
        ? { [field.key]: value }
        : { fields: { [field.key]: value } };

      await updateTwin(body);
    },
  };

  async function handleOnTransitionPerformSuccess() {
    try {
      updateTwin({});
      toast.success("Transition is performed successfully");
    } catch (error) {
      toast.error("Error performing transition");
    }
  }

  return (
    <div>
      {label &&
        (isPopulatedString(label) ? (
          <label className="px-3 text-sm font-bold">{label}</label>
        ) : (
          label
        ))}
      {field.descriptor ? (
        <InPlaceEdit {...editProps} />
      ) : (
        <div className="px-3 flex gap-2">
          {renderPreview({
            onTransitionPerformSuccess: handleOnTransitionPerformSuccess,
          })}
        </div>
      )}
    </div>
  );
}
