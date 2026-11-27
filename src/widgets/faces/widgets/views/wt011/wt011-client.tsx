"use client";

import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { CSSProperties, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  TWIN_SELF_FIELD_KEYS,
  TwinSelfFieldKey,
  useTwinUpdate,
} from "@/entities/twin";
import { Twin, TwinUpdateRq } from "@/entities/twin/server";
import { TwinFieldUI, stringifyTwinFieldValue } from "@/entities/twinField";
import { TwinFieldEditor } from "@/features/twin/ui/field-editor";
import { RelatedObjects } from "@/shared/api";
import { cn, isPopulatedString } from "@/shared/libs";
import { Button } from "@/shared/ui";

import { TwinFieldFormField } from "../../../../form-fields";

export type WT011ClientField = {
  id: string;
  label: string;
  required: boolean;
  widthWeight?: number;
  styleClasses?: string[];
  /** Missing when the field could not be resolved on the twin. */
  field?: TwinFieldUI;
  editable: boolean;
};

export type WT011ClientRow = {
  id: string;
  allowWrap: boolean;
  styleClasses?: string[];
  fields: WT011ClientField[];
};

export type WT011ClientSection = {
  id: string;
  label?: string;
  styleClasses?: string[];
  rows: WT011ClientRow[];
};

export type WT011ClientColumn = {
  id: string;
  widthWeight?: number;
  /** Position when the columns stack vertically on a narrow container. */
  stackOrder: number;
  styleClasses?: string[];
  sections: WT011ClientSection[];
};

type Props = {
  title?: string;
  submitLabel: string;
  cancelLabel: string;
  twinId: string;
  twin: Twin;
  relatedObjects?: RelatedObjects;
  canEdit: boolean;
  columns: WT011ClientColumn[];
};

type Mode = "view" | "edit";
type FormValues = Record<string, string>;

/**
 * A field wider than this (per unit of weight) does not fit next to its
 * siblings, so a wrapping row moves it to a new line. Using a basis
 * proportional to the weight keeps the weighted ratio exact while the fields
 * share a line.
 */
const FIELD_BASIS_REM_PER_WEIGHT = 12;

export function WT011Client({
  title,
  submitLabel,
  cancelLabel,
  twinId,
  twin,
  relatedObjects,
  canEdit,
  columns,
}: Props) {
  const router = useRouter();
  const { updateTwin, loading } = useTwinUpdate();
  const [mode, setMode] = useState<Mode>("view");

  const editableFields = columns.flatMap((column) =>
    column.sections.flatMap((section) =>
      section.rows.flatMap((row) =>
        row.fields.filter((item) => item.editable && item.field)
      )
    )
  );

  const showEditButton = canEdit && editableFields.length > 0;

  const initialValues: FormValues = Object.fromEntries(
    editableFields.map((item) => [
      formName(item),
      stringifyTwinFieldValue(item.field!.value),
    ])
  );

  const form = useForm<FormValues>({ defaultValues: initialValues });

  function startEdit() {
    form.reset(initialValues);
    setMode("edit");
  }

  function cancelEdit() {
    form.reset(initialValues);
    setMode("view");
  }

  async function submit(values: FormValues) {
    const missing = editableFields.filter(
      (item) => item.required && !isPopulatedString(values[formName(item)])
    );

    if (missing.length > 0) {
      missing.forEach((item) =>
        form.setError(formName(item), { message: "Required" })
      );
      return;
    }

    const body: Omit<TwinUpdateRq, "twinId"> = {};
    const fields: Record<string, string> = {};

    for (const item of editableFields) {
      const name = formName(item);
      const value = values[name] ?? "";
      if (value === initialValues[name]) continue;

      const key = item.field!.key;
      if (TWIN_SELF_FIELD_KEYS.includes(key as TwinSelfFieldKey)) {
        (body as Record<string, string>)[key] = value;
      } else {
        fields[key] = value;
      }
    }

    if (Object.keys(fields).length > 0) body.fields = fields;

    if (Object.keys(body).length === 0) {
      setMode("view");
      return;
    }

    try {
      await updateTwin({ id: twinId, body });
      toast.success("Twin was updated successfully!");
      setMode("view");
      router.refresh();
    } catch {
      toast.error("Failed to update twin!");
    }
  }

  function renderField(item: WT011ClientField) {
    if (!item.field) {
      return (
        <div className="text-destructive text-sm">Field failed to load.</div>
      );
    }

    if (mode === "edit" && item.editable) {
      return (
        <TwinFieldFormField
          name={formName(item)}
          control={form.control}
          label={item.label}
          required={item.required}
          descriptor={item.field.descriptor}
          twinId={twinId}
        />
      );
    }

    const inlineEditable = mode === "view" && item.editable;
    const isEmpty =
      stringifyTwinFieldValue(item.field.value) === "" &&
      item.field.descriptor?.fieldType !== "booleanV1";

    // A read-only empty field shows a dash so the label is not left hanging.
    if (isEmpty && !inlineEditable) {
      return (
        <div className="space-y-1">
          <div className="text-muted-foreground text-sm">{item.label}</div>
          <div className="text-muted-foreground">—</div>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        <div className="text-muted-foreground text-sm">{item.label}</div>
        <TwinFieldEditor
          id={item.id}
          twinId={twinId}
          twin={twin}
          relatedObjects={relatedObjects}
          field={item.field}
          // In view mode editable fields are edited one by one in place; in
          // edit mode the form owns them, the rest stay display-only.
          editable={inlineEditable}
        />
      </div>
    );
  }

  const layout = (
    // The layout adapts to the widget's own width, not the viewport: a form
    // placed in a narrow page column stacks like it would on a phone.
    <div className="@container">
      <div className="flex flex-col gap-4 @3xl:flex-row @3xl:items-start">
        {columns.map((column) => (
          <div
            key={column.id}
            style={
              {
                "--wt011-stack-order": column.stackOrder,
                flexGrow: positiveWeight(column.widthWeight),
              } as CSSProperties
            }
            className={cn(
              "flex min-w-0 flex-col gap-4",
              "order-[var(--wt011-stack-order)] @3xl:order-none @3xl:basis-0",
              column.styleClasses
            )}
          >
            {column.sections.map((section) => (
              <section
                key={section.id}
                className={cn(
                  "border-border space-y-4 rounded-lg border p-4",
                  section.styleClasses
                )}
              >
                {section.label && (
                  <h3 className="text-brand-600 text-base font-semibold">
                    {section.label}
                  </h3>
                )}
                {section.rows.map((row) => (
                  <div
                    key={row.id}
                    className={cn(
                      "flex gap-4",
                      row.allowWrap ? "flex-wrap" : "flex-nowrap",
                      row.styleClasses
                    )}
                  >
                    {row.fields.map((item) => (
                      <div
                        key={item.id}
                        style={{ flex: fieldFlex(item, row.allowWrap) }}
                        className={cn("min-w-0", item.styleClasses)}
                      >
                        {renderField(item)}
                      </div>
                    ))}
                  </div>
                ))}
              </section>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4 pt-4 pb-6">
      {(title || showEditButton) && (
        // Fixed height: the header keeps its place when the Edit button hides
        // in edit mode, so the form below does not jump.
        <div className="flex min-h-9 items-center justify-between gap-2">
          {title ? (
            <h2 className="text-lg font-semibold">{title}</h2>
          ) : (
            <span />
          )}
          {showEditButton && mode === "view" && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={startEdit}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      )}

      {mode === "edit" ? (
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
            {layout}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={cancelEdit}
                disabled={loading}
              >
                {cancelLabel}
              </Button>
              <Button type="submit" loading={loading}>
                {submitLabel}
              </Button>
            </div>
          </form>
        </FormProvider>
      ) : (
        layout
      )}
    </div>
  );
}

// A layout field id never contains dots, so it is safe as a form path; the
// prefix keeps ids that start with a digit from being read as array indexes.
function formName(item: WT011ClientField) {
  return `field_${item.id}`;
}

function positiveWeight(weight?: number) {
  return weight && weight > 0 ? weight : 1;
}

function fieldFlex(item: WT011ClientField, allowWrap: boolean) {
  const weight = positiveWeight(item.widthWeight);

  return allowWrap
    ? `${weight} 1 ${weight * FIELD_BASIS_REM_PER_WEIGHT}rem`
    : `${weight} 1 0%`;
}
