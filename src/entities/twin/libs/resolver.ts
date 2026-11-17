import { zodResolver } from "@hookform/resolvers/zod";
import { FieldError, FieldErrors, Resolver } from "react-hook-form";

import type { TwinClass_DETAILED } from "@/entities/twin-class";
import { isPopulatedArray } from "@/shared/libs";

import { TWIN_SCHEMA } from "./schemas";
import type { TwinFormValues } from "./types";

const schemaResolver = zodResolver(TWIN_SCHEMA);

function isEmptyFieldValue(value: unknown) {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/**
 * The class fields the form must not leave empty. The class is read from the
 * raw `classId` value — the selected class object, before the schema turns it
 * into an id — since the required flags live on its fields.
 */
function findMissingRequiredFields(
  values: TwinFormValues
): Record<string, FieldError> {
  const rawClassId = values.classId as unknown;
  if (!isPopulatedArray<TwinClass_DETAILED>(rawClassId)) return {};

  const fieldValues = (values.fields ?? {}) as Record<string, unknown>;
  const missing: Record<string, FieldError> = {};

  for (const field of rawClassId[0]?.fields ?? []) {
    if (!field.required || !field.key) continue;
    if (!isEmptyFieldValue(fieldValues[field.key])) continue;

    missing[field.key] = {
      type: "required",
      message: `${field.name || field.key} is required`,
    };
  }

  return missing;
}

/**
 * Validates the twin create form: the static schema, plus the class fields
 * marked `required`, which the schema can't know about — they depend on the
 * class picked in the form.
 */
export const twinFormResolver: Resolver<TwinFormValues> = async (
  values,
  context,
  options
) => {
  const result = await schemaResolver(values, context, options);
  const missing = findMissingRequiredFields(values);
  if (Object.keys(missing).length === 0) return result;

  const schemaErrors = result.errors as FieldErrors<TwinFormValues>;
  const errors = {
    ...schemaErrors,
    fields: {
      ...(schemaErrors.fields as Record<string, FieldError> | undefined),
      ...missing,
    },
  } as FieldErrors<TwinFormValues>;

  return { values: {}, errors };
};
