import { TwinClassFieldCreateRq } from "@/entities/twin-class-field";

import { TwinClassFieldFormValues } from "./types";

/**
 * Shared by the fields table and the cascading create panel, so both post the
 * very same body. `twinClassId` overrides the form value when the table is
 * already scoped to a class.
 */
export function buildTwinClassFieldCreateRq(
  values: TwinClassFieldFormValues,
  twinClassId?: string
): TwinClassFieldCreateRq {
  return {
    twinClassFields: [
      {
        twinClassId: twinClassId || values.twinClassId!,
        key: values.key,
        required: values.required,
        system: values.system,
        nameI18n: { translationInCurrentLocale: values.name },
        descriptionI18n: { translationInCurrentLocale: values.description },
        fieldTyperFeaturerId: values.fieldTyperFeaturerId,
        fieldTyperParams: values.fieldTyperParams,
        twinSorterFeaturerId: values.twinSorterFeaturerId,
        twinSorterParams: values.twinSorterParams,
        viewPermissionId: values.viewPermissionId,
        editPermissionId: values.editPermissionId,
        externalId: values.externalId,
        fieldInitializerFeaturerId: Number(values.fieldInitializerFeaturerId),
        fieldInitializerParams: values.fieldInitializerParams,
      },
    ],
  };
}
