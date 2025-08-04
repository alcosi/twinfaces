import { useEffect, useState } from "react";
import { Control, useForm, useFormContext } from "react-hook-form";

import { ComboboxFormField } from "@/components/form-fields";

import { FaceTC001ViewRs } from "@/entities/face";
import { TwinFormValues, useTwinClassFields } from "@/entities/twin";
import {
  TwinClassField,
  useTwinClassFieldSearch,
} from "@/entities/twin-class-field";
import { reduceToObject, toArray } from "@/shared/libs";

import { buildFieldElements, useSyncFormFields } from "../utils";

type Props = {
  control: Control<TwinFormValues>;
  modalCreateData?: FaceTC001ViewRs;
  firstOption: NonNullable<
    NonNullable<FaceTC001ViewRs["faceTwinCreate"]>["options"]
  >[0];
};

export function SilentModeForm({ control, firstOption }: Props) {
  const form = useFormContext<TwinFormValues>();
  const selectedClass = form.watch("classId");
  const { searchBySearchId } = useTwinClassFieldSearch();
  const [fetchedFields, setFetchedFields] = useState<TwinClassField[]>([]);

  console.log("foobar render#", firstOption);

  // useSyncFormFields({
  //   form,
  //   fromKey: "classId",
  //   toKey: "headTwinId",
  //   merge: (fromValue, toValue) => firstOption.pointedHeadTwinId,
  // });

  useEffect(() => {
    console.log("foobar useEffect#", firstOption);
    form.setValue("headTwinId", firstOption.pointedHeadTwinId);
  }, [firstOption, form.setValue]);

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

  const { twinClassBySearchIdAdapter } = useTwinClassFields(control, {
    baseTwinClassId: firstOption?.twinClassSearchId,
    twinClassSearchParams: firstOption?.twinClassSearchParams,
  });

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
        selectedClass,
      })}
    </div>
  );
}
