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
import { User } from "@/entities/user";
import { RelatedObjects } from "@/shared/api";
import {
  HAS_ADMIN_ACCESS,
  cn,
  formatIntlDate,
  isPopulatedString,
  mapPatternToInputType,
} from "@/shared/libs";
import { AnchorWithCopy, MaskedValue } from "@/shared/ui";
import { Switch } from "@/shared/ui/switch";

import { DatalistOptionResourceLink } from "../../../../features/datalist-option/ui";
import { MarkdownPreview } from "../../../../features/markdown";
import { TwinResourceLink } from "../../../../features/twin/ui";
import { UserResourceLink } from "../../../../features/user/ui";
import { InPlaceEdit, InPlaceEditProps } from "../../../inPlaceEdit";
import { STATIC_FIELD_MAP } from "./constants";

type FieldProps = {
  id: string;
  key: StaticTwinFieldKey | string;
  value: string;
  name?: string;
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
  mode?: typeof HAS_ADMIN_ACCESS;
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

    return renderDynamicFieldPreview(
      field,
      relatedObjects,
      mode,
      handleOnSubmit
    );
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

  const shouldRenderPreview =
    !editable ||
    !field.descriptor ||
    field.descriptor.fieldType === "booleanV1";

  return (
    <div>
      {label &&
        (isPopulatedString(label) ? (
          <label className="text-sm font-bold">{label}</label>
        ) : (
          label
        ))}

      {shouldRenderPreview ? renderPreview() : <InPlaceEdit {...editProps} />}
    </div>
  );
}

function renderDynamicFieldPreview(
  field: FieldProps,
  relatedObjects?: RelatedObjects,
  mode?: typeof HAS_ADMIN_ACCESS,
  handleSubmit?: (value: string) => void
): ReactNode {
  const fieldType = field.descriptor?.fieldType;
  if (fieldType === "urlV1") {
    return (
      <AnchorWithCopy href={field.value} target="_blank">
        {field.value}
      </AnchorWithCopy>
    );
  }

  if (fieldType === "secretV1") {
    return <MaskedValue value={field.value} />;
  }

  if (
    fieldType === "textV1" &&
    (field.descriptor?.editorType === "MARKDOWN_BASIC" ||
      field.descriptor?.editorType === "MARKDOWN_GITHUB")
  ) {
    return <MarkdownPreview source={field.value} />;
  }

  if (fieldType === "dateScrollV1") {
    const format = isPopulatedString(field.descriptor?.pattern)
      ? mapPatternToInputType(field.descriptor.pattern)
      : "text";
    return isPopulatedString(field.value)
      ? formatIntlDate(field.value, format)
      : "";
  }

  if (
    fieldType === "selectListV1" ||
    fieldType === "selectLongV1" ||
    fieldType === "selectSharedInHeadV1"
  ) {
    const datalistOptionData =
      relatedObjects?.dataListsOptionMap?.[field.value];

    return (
      datalistOptionData && (
        <DatalistOptionResourceLink
          data={datalistOptionData}
          withTooltip
          disabled={mode !== HAS_ADMIN_ACCESS}
        />
      )
    );
  }

  if (fieldType === "selectLinkV1" || fieldType === "selectLinkLongV1") {
    const twinData = relatedObjects?.twinMap?.[field.value];

    return (
      twinData && (
        <TwinResourceLink
          data={twinData}
          withTooltip
          disabled={mode !== HAS_ADMIN_ACCESS}
        />
      )
    );
  }

  if (fieldType === "selectUserV1" || fieldType === "selectUserLongV1") {
    const userData = relatedObjects?.userMap?.[field.value];

    return (
      field.value && (
        <UserResourceLink
          data={userData as User}
          withTooltip
          disabled={mode !== HAS_ADMIN_ACCESS}
        />
      )
    );
  }

  if (fieldType === "booleanV1") {
    const checked = field.value === "true";

    return (
      <Switch
        checked={checked}
        onCheckedChange={(val) => handleSubmit && handleSubmit(String(val))}
      />
    );
  }

  return <p>{field.value}</p>;
}
