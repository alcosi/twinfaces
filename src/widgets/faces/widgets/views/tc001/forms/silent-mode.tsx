import { useEffect, useState } from "react";
import { Control, Path, useFormContext } from "react-hook-form";

import { ComboboxFormField } from "@/components/form-fields";

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
  modalCreateData?: FaceTC001ViewRs;
  firstOption: NonNullable<
    NonNullable<FaceTC001ViewRs["faceTwinCreate"]>["options"]
  >[0];
  selfFields: Partial<Record<string, TwinSelfFieldRenderer>>;
  nameMap: Partial<Record<TwinSelfFieldId, Path<TwinFormValues>>>;
};

export function SilentModeForm({
  control,
  firstOption,
  selfFields,
  nameMap,
}: Props) {
  const { setValue, watch } = useFormContext<TwinFormValues>();
  const selectedClass = watch("classId");
  const { searchBySearchId } = useTwinClassFieldSearch();
  const [fetchedFields, setFetchedFields] = useState<TwinClassField[]>([]);

  useEffect(() => {
    setValue("headTwinId", firstOption.pointedHeadTwinId);
    setValue("classId", "");
  }, [firstOption, setValue]);

  useEffect(() => {
    const fetchFields = async () => {
      if (firstOption.twinClassFieldSearchId && selectedClass) {
        const result = await searchBySearchId({
          searchId: firstOption.twinClassFieldSearchId,
          narrow: {
            twinClassIdMap: reduceToObject({
              list: toArray(selectedClass),
              defaultValue: true,
            }),
          },
          params: firstOption.twinClassFieldsSearchParams!,
        });
        setFetchedFields(result?.data ?? []);
      } else {
        setFetchedFields([]);
      }
    };
    fetchFields();
  }, [firstOption, selectedClass, searchBySearchId]);

  const { twinClassBySearchIdAdapter, userAdapter } = useTwinClassFields(
    control,
    {
      baseTwinClassId: firstOption?.twinClassSearchId,
      twinClassSearchParams: firstOption?.twinClassSearchParams,
    }
  );

  return (
    <div className="space-y-8">
      {firstOption.twinClassSearchId && (
        <ComboboxFormField
          control={control}
          name="classId"
          label={firstOption.classSelectorLabel || "Select class"}
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
