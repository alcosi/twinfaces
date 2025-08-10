import { useEffect, useRef, useState } from "react";
import { Path, useFormContext, useWatch } from "react-hook-form";

import { ComboboxFormField } from "@/components/form-fields";

import { FaceTC001ViewRs } from "@/entities/face";
import {
  TWIN_SELF_FIELD_ID_TO_KEY_MAP,
  TwinFormValues,
  TwinSelfFieldId,
  useTwinClassFields,
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
import { Skeleton } from "@/shared/ui";

import { TwinFieldFormField } from "../../../../form-fields";
import { useSyncFormFields } from "./utils";

type SelectedOptionProps = {
  twinClassSearchId?: string;
  twinClassSearchParams?: Record<string, string>;
  classSelectorLabel?: string;
  pointedHeadTwinId?: string;
  twinClassFieldSearchId?: string;
  twinClassFieldsSearchParams?: Record<string, string>;
};

type TwinFormValuesByOption = TwinFormValues & {
  options: SelectedOptionProps[];
};

export function TC001Form({ payload }: { payload: FaceTC001ViewRs }) {
  const form = useFormContext<TwinFormValuesByOption>();

  const { faceTwinCreate } = payload;
  const variantOptions = faceTwinCreate?.options || [];

  const isSilent =
    faceTwinCreate?.singleOptionSilentMode && !isEmptyArray(variantOptions);

  const selectedOptions = form.getValues("options");
  const selectedClass = useWatch({ control: form.control, name: "classId" });

  const { searchBySearchId, loading } = useTwinClassFieldSearch();
  const [fields, setFields] = useState<TwinClassField[]>([]);
  const didSeed = useRef(false);

  if (
    !didSeed.current &&
    isSilent &&
    isPopulatedArray<SelectedOptionProps>(variantOptions)
  ) {
    form.setValue("options", [variantOptions[0]]);
    didSeed.current = true;
  }

  useEffect(() => {
    const fetchFields = async () => {
      if (
        isPopulatedArray<SelectedOptionProps>(selectedOptions) &&
        isTruthy(selectedOptions[0].twinClassSearchId) &&
        isPopulatedArray(selectedClass)
      ) {
        const result = await searchBySearchId({
          searchId: selectedOptions[0].twinClassFieldSearchId!,
          narrow: {
            twinClassIdMap: reduceToObject({
              list: toArray(selectedClass),
              defaultValue: true,
            }),
          },
          params: selectedOptions[0].twinClassFieldsSearchParams,
        });

        setFields(result?.data ?? []);
      } else {
        setFields([]);
      }
    };

    fetchFields();
  }, [selectedOptions, selectedClass, searchBySearchId]);

  return (
    <div className="space-y-8">
      <span className={cn(isSilent && "hidden")}>
        <ComboboxFormField
          control={form.control}
          name="options"
          label={faceTwinCreate?.optionSelectLabel}
          getItems={async () => variantOptions}
          getById={async (id) => variantOptions.find((o) => o.id === id)}
          renderItem={(item) => item.label}
          required
          onSelect={() => {
            form.resetField("classId");
            form.resetField("fields");
            setFields([]);
          }}
        />
      </span>
      <TwinClassSelector />

      {loading &&
        Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}

      {!loading &&
        fields.map((field) => {
          const selfTwinFieldKey =
            TWIN_SELF_FIELD_ID_TO_KEY_MAP[field.id as TwinSelfFieldId];
          const name = (selfTwinFieldKey ??
            `fields.${field.key}`) as Path<TwinFormValuesByOption>;

          return (
            <TwinFieldFormField
              key={field.key}
              name={name}
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
    </div>
  );
}

function TwinClassSelector() {
  const form = useFormContext<TwinFormValuesByOption>();
  const selectedOptions = form.watch("options");
  const selectedOption = isPopulatedArray<SelectedOptionProps>(selectedOptions)
    ? selectedOptions[0]
    : undefined;

  const { twinClassBySearchIdAdapter } =
    useTwinClassFields<TwinFormValuesByOption>(form.control, {
      baseTwinClassId: selectedOption?.twinClassSearchId,
      twinClassSearchParams: selectedOption?.twinClassSearchParams,
    });

  // NOTE: Keep headTwinId in sync with the option's pointedHeadTwinId
  useSyncFormFields({
    form,
    fromKey: "options",
    toKey: "headTwinId",
    merge: (fromValue, _) => fromValue?.[0]?.pointedHeadTwinId,
  });

  if (!selectedOption?.twinClassSearchId) {
    return null;
  }

  return (
    <ComboboxFormField
      control={form.control}
      name="classId"
      label={selectedOption.classSelectorLabel || "Select class"}
      {...twinClassBySearchIdAdapter}
      required
    />
  );
}
