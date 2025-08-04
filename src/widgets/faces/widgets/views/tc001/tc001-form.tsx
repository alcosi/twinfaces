import { DevTool } from "@hookform/devtools";
import { useEffect, useState } from "react";
import { Control, useFormContext } from "react-hook-form";

import { ComboboxFormField } from "@/components/form-fields";

import { FaceTC001ViewRs } from "@/entities/face";
import {
  TWIN_SELF_FIELD_ID_TO_KEY_MAP,
  TwinFormValues,
  TwinSelfFieldId,
} from "@/entities/twin";
import {
  TwinClassField,
  useTwinClassFieldSearch,
} from "@/entities/twin-class-field";
import {
  cn,
  isEmptyArray,
  isPopulatedArray,
  isTruthy,
  reduceToObject,
  toArray,
} from "@/shared/libs";
import { TwinFieldFormField } from "@/widgets/form-fields";

import { MultiModeForm } from "./forms/multi-mode";
import { SilentModeForm } from "./forms/silent-mode";

export type Foobar = TwinFormValues & {
  optionId: any;
};

export function TC001Form({
  // control,
  payload,
}: {
  control?: Control<Foobar>;
  payload: FaceTC001ViewRs;
}) {
  const form = useFormContext<Foobar>();

  const { faceTwinCreate } = payload;
  const variantOptions = faceTwinCreate?.options || [];

  const isSilent =
    faceTwinCreate?.singleOptionSilentMode && !isEmptyArray(variantOptions);

  const selectedOptions = form.getValues("optionId");
  const selectedClass = form.getValues("classId");

  const { searchBySearchId } = useTwinClassFieldSearch();
  const [fields, setFields] = useState<TwinClassField[]>([]);

  useEffect(() => {
    const fetchFields = async () => {
      if (
        isPopulatedArray<any>(selectedOptions) &&
        isTruthy(selectedOptions[0].twinClassSearchId) &&
        selectedClass
      ) {
        const result = await searchBySearchId({
          searchId: selectedOptions[0].twinClassFieldSearchId,
          narrow: {
            twinClassIdMap: reduceToObject({
              list: toArray(selectedClass),
              defaultValue: true,
            }),
          },
          params: selectedOptions[0].twinClassFieldsSearchParams!,
        });
        setFields(result?.data ?? []);
      } else {
        setFields([]);
      }
    };
    fetchFields();
  }, [selectedOptions, selectedClass, searchBySearchId]);

  return (
    <div>
      <div className={cn(isSilent && "hidden")}>
        <ComboboxFormField
          control={form.control}
          name="optionId"
          label="select option"
          // {...twinClassBySearchIdAdapter}

          getItems={async () => variantOptions}
          getById={async (id) => variantOptions.find((o) => o.id === id)}
          renderItem={(item) => item.label}
          required
        />
      </div>
      {isSilent ? (
        <SilentModeForm
          control={form.control}
          firstOption={variantOptions[0]!}
        />
      ) : (
        <MultiModeForm />
      )}
      {fields.map((field) => {
        const selfTwinFieldKey =
          TWIN_SELF_FIELD_ID_TO_KEY_MAP[field.id as TwinSelfFieldId];

        return (
          <TwinFieldFormField
            key={field.key}
            name={selfTwinFieldKey ?? `fields.${field.key}`}
            control={form.control}
            label={field.name}
            descriptor={field.descriptor}
            twinClassId={
              isPopulatedArray<{ id: string }>(selectedClass)
                ? selectedClass[0]?.id
                : ""
            }
            required={field.required}
          />
        );
      })}
      <DevTool control={form.control} /> {/* set up the dev tool */}
    </div>
  );
}
