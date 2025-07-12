"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { toast } from "sonner";
import { ZodType, z } from "zod";

import { AutoFormValueType } from "@/components/auto-field";

import {
  TWIN_SELF_FIELD_KEYS,
  TwinSelfFieldId,
  TwinSelfFieldKey,
  useTwinUpdate,
} from "@/entities/twin";
import { Twin, TwinUpdateRq, hydrateTwinFromMap } from "@/entities/twin/server";
import { RelatedObjects } from "@/shared/api";
import { cn, isPopulatedString } from "@/shared/libs";

import { InPlaceEdit } from "../../../inPlaceEdit";
import { SELF_FIELD_MAP } from "./constants";
import { InheritedFieldPreview } from "./inherited-field-preview";
import { FieldProps } from "./types";

export type TwinFieldEditorProps = {
  id: string;
  twinId: string;
  twin: Twin;
  label?: ReactNode;
  field: FieldProps;
  schema?: ZodType;
  relatedObjects?: RelatedObjects;
  onSuccess?: () => void;
  className?: string;
  mode?: "admin";
  editable?: boolean;
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
  className,
  mode,
  editable = false,
}: TwinFieldEditorProps) {
  const { updateTwin } = useTwinUpdate();
  const router = useRouter();

  const selfFieldRenderPreview =
    SELF_FIELD_MAP[field.id as TwinSelfFieldId]?.renderPreview;
  const staticFieldClassName =
    SELF_FIELD_MAP[field.id as TwinSelfFieldId]?.className;

  const hydratedTwin = hydrateTwinFromMap(twin, relatedObjects);

  const shouldRenderPreview =
    !editable ||
    !field.descriptor ||
    field.descriptor.fieldType === "booleanV1";

  function renderPreview() {
    if (selfFieldRenderPreview) {
      return selfFieldRenderPreview(hydratedTwin, {
        disabled: mode !== "admin",
      });
    }

    return (
      <InheritedFieldPreview
        field={field}
        relatedObjects={relatedObjects}
        disabled={mode !== "admin"}
        onChange={handleOnSubmit}
      />
    );
  }

  async function handleOnSubmit(value: string) {
    const body: TwinUpdateRq = TWIN_SELF_FIELD_KEYS.includes(
      field.key as TwinSelfFieldKey
    )
      ? { [field.key]: value }
      : { fields: { [field.key]: value } };

    try {
      await updateTwin({ id: twinId, body });
      toast.success("Twin was updated successfully!");
      onSuccess?.() || router.refresh();
    } catch {
      toast.error("Failed to update twin!");
    }
  }

  return (
    <div>
      {label &&
        (isPopulatedString(label) ? (
          <label className="text-sm font-bold">{label}</label>
        ) : (
          label
        ))}

      {shouldRenderPreview ? (
        renderPreview()
      ) : (
        <InPlaceEdit
          id={id}
          value={field.value}
          valueInfo={{
            type: AutoFormValueType.twinField,
            label: undefined,
            descriptor: field.descriptor,
            twinId,
          }}
          renderPreview={renderPreview}
          schema={schema ?? z.string().min(1)}
          onSubmit={handleOnSubmit}
          className={cn(className, staticFieldClassName)}
        />
      )}
    </div>
  );
}
