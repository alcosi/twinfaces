import { useEffect, useMemo, useState } from "react";
import { Control, Path, useFormContext } from "react-hook-form";

import { ComboboxFormField, ComboboxFormItem } from "@/components/form-fields";

import { FaceTC001ViewRs } from "@/entities/face";
import {
  TwinFormValues,
  TwinSelfFieldId,
  useTwinClassFields,
} from "@/entities/twin";
import {
  TwinClassField,
  useTwinClassFieldSearch,
} from "@/entities/twin-class-field";
import { reduceToObject, toArray } from "@/shared/libs";

import { TwinSelfFieldRenderer } from "../tc001-form";
import { buildFieldElements } from "./build-field-elements";

type Props = {
  control: Control<TwinFormValues>;
  modalCreateData: FaceTC001ViewRs;
  options: NonNullable<FaceTC001ViewRs["faceTwinCreate"]>["options"];
  selfFields: Partial<Record<string, TwinSelfFieldRenderer>>;
  nameMap: Partial<Record<TwinSelfFieldId, Path<TwinFormValues>>>;
};

export function MultiModeForm({
  control,
  modalCreateData,
  options,
  selfFields,
  nameMap,
}: Props) {
  const { setValue, watch } = useFormContext<TwinFormValues>();
  const { faceTwinCreate } = modalCreateData;
  const { searchBySearchId } = useTwinClassFieldSearch();
  const selectedClass = watch("classId");
  const [selectedOptionId, setSelectedOptionId] = useState<
    string | undefined
  >();
  const [fetchedFields, setFetchedFields] = useState<TwinClassField[]>([]);

  const selectedOption = useMemo(
    () => options?.find((o) => o.id === selectedOptionId),
    [options, selectedOptionId]
  );

  useEffect(() => {
    if (selectedOption?.pointedHeadTwinId) {
      setValue("headTwinId", selectedOption.pointedHeadTwinId);
    }
  }, [selectedOption, setValue]);

  useEffect(() => {
    const fetchFields = async () => {
      if (selectedOption?.twinClassFieldSearchId && selectedClass) {
        const result = await searchBySearchId({
          searchId: selectedOption.twinClassFieldSearchId,
          narrow: {
            twinClassIdMap: reduceToObject({
              list: toArray(selectedClass),
              defaultValue: true,
            }),
          },
          params: selectedOption.twinClassFieldsSearchParams!,
        });
        setFetchedFields(result?.data ?? []);
      } else {
        setFetchedFields([]);
      }
    };
    fetchFields();
  }, [selectedOption, selectedClass, searchBySearchId]);

  const { twinClassBySearchIdAdapter, userAdapter } = useTwinClassFields(
    control,
    {
      baseTwinClassId: selectedOption?.twinClassSearchId,
      twinClassSearchParams: selectedOption?.twinClassSearchParams,
    }
  );

  return (
    <div className="space-y-8">
      <ComboboxFormItem
        label={faceTwinCreate?.optionSelectLabel ?? "Select variant"}
        onSelect={(selected) => {
          setSelectedOptionId(selected?.[0]?.id);
          setValue("classId", "");
        }}
        getItems={() =>
          Promise.resolve(
            options?.map((opt) => ({
              id: opt.id,
              label: opt.label || "N/A",
            })) ?? []
          )
        }
        getById={async (id) => {
          const found = options?.find((opt) => opt.id === id);
          return found
            ? { id: found.id, label: found.label || "N/A" }
            : undefined;
        }}
        renderItem={(item) => item.label}
        required
      />

      {selectedOption?.twinClassSearchId && (
        <ComboboxFormField
          control={control}
          name="classId"
          label={selectedOption.classSelectorLabel || "Select class"}
          {...twinClassBySearchIdAdapter}
          required
        />
      )}

      {buildFieldElements({
        fields: fetchedFields,
        control,
        selfFields,
        nameMap,
        selectedClass,
        userAdapter,
      })}
    </div>
  );
}
