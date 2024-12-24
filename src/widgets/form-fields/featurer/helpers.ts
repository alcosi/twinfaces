import { FeaturerValue } from "@/entities/featurer";
import { FormFieldValidationError, isEmptyArray } from "@/shared/libs";
import { ParamTypeSchemaMap } from "./constants";

function validateParamType(
  property: string,
  param: FeaturerValue["params"][string]
): FormFieldValidationError | null {
  if (!param || !param.type) {
    return {
      key: property,
      message: "Parameter is missing or invalid.",
    };
  }

  const schema = ParamTypeSchemaMap[param.type];

  if (!schema) {
    return {
      key: property,
      message: `Unsupported parameter type: ${param.type}`,
    };
  }

  const { success, error } = schema.safeParse(param.value);

  if (!success) {
    return {
      key: property,
      message: error?.errors?.[0]?.message || "Unknown validation error",
    };
  }

  return null;
}

export function validateParamTypes(params: FeaturerValue["params"]): {
  success: boolean;
  errors: FormFieldValidationError[];
} {
  const errors: FormFieldValidationError[] = [];

  Object.entries(params).forEach(([property, param]) => {
    const error = validateParamType(property, param);
    if (error) {
      errors.push(error);
    }
  });

  return {
    success: isEmptyArray(errors),
    errors,
  };
}
