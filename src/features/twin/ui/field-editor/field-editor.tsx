"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { toast } from "sonner";
import { ZodType, z } from "zod";

import { AutoFormValueType } from "@/components/auto-field";

import {
  STATIC_TWIN_FIELD_KEYS,
  StaticTwinFieldId,
  StaticTwinFieldKey,
  useTwinUpdate,
} from "@/entities/twin";
import { TwinClassField } from "@/entities/twin-class-field";
import { Twin, TwinUpdateRq, hydrateTwinFromMap } from "@/entities/twin/server";
import { RelatedObjects } from "@/shared/api";
import {
  cn,
  formatIntlDate,
  isPopulatedString,
  mapPatternToInputType,
} from "@/shared/libs";

import { InPlaceEdit, InPlaceEditProps } from "../../../inPlaceEdit";
import { SecretFieldPreview } from "../../../ui/secret-field-preview";
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

  const staticFieldRenderPreview =
    STATIC_FIELD_MAP[field.id as StaticTwinFieldId]?.renderPreview;
  const staticFieldClassName =
    STATIC_FIELD_MAP[field.id as StaticTwinFieldId]?.className;

  const hydratedTwin = hydrateTwinFromMap(twin, relatedObjects);

  function renderPreview() {
    if (staticFieldRenderPreview) {
      return staticFieldRenderPreview(hydratedTwin, mode);
    }

    return renderDynamicFieldPreview(field, relatedObjects);
  }

  async function handleOnSubmit(value: string) {
    const body: TwinUpdateRq = STATIC_TWIN_FIELD_KEYS.includes(
      field.key as StaticTwinFieldKey
    )
      ? { [field.key]: value }
      : { fields: { [field.key]: value } };

    try {
      await updateTwin({ id: twinId, body });
      toast.success("Twin was updated successfully!");
      onSuccess?.() || router.refresh();
    } catch (error) {
      toast.error("Failed to update twin!");
    }
  }

  const editProps: InPlaceEditProps<string> = {
    id,
    value: field.value,
    valueInfo: {
      type: AutoFormValueType.twinField,
      label: undefined,
      descriptor: field.descriptor,
      twinId,
    },
    renderPreview: renderPreview,
    schema: schema ?? z.string().min(1),
    onSubmit: handleOnSubmit,
    className: cn(className, staticFieldClassName),
  };

  return (
    <div>
      {label &&
        (isPopulatedString(label) ? (
          <label className="text-sm font-bold">{label}</label>
        ) : (
          label
        ))}

      {editable && field.descriptor ? (
        <InPlaceEdit {...editProps} />
      ) : (
        renderPreview()
      )}
    </div>
  );
}

function renderDynamicFieldPreview(
  field: FieldProps,
  relatedObjects?: RelatedObjects
): ReactNode {
  const fieldType = field.descriptor?.fieldType;

  if (fieldType === "secretV1") {
    return <SecretFieldPreview value={field.value} />;
  }

  if (fieldType === "dateScrollV1") {
    const format = isPopulatedString(field.descriptor?.pattern)
      ? mapPatternToInputType(field.descriptor.pattern)
      : "text";
    return isPopulatedString(field.value)
      ? formatIntlDate(field.value, format)
      : "";
  }

  return (
    <div>
      {relatedObjects?.dataListsOptionMap?.[field.value]?.name ?? field.value}
    </div>
  );
}
