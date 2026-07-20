import { Control, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  AutoFormComplexComboboxValueInfo,
  AutoFormValueType,
} from "@/components/auto-field";
import { ComplexComboboxFormField } from "@/components/complex-combobox";
import { TextFormField } from "@/components/form-fields";

import {
  DataList,
  useDatalistFilters,
  useDatalistSelectAdapterWithFilters,
} from "@/entities/datalist";
import { DATALIST_OPTION_SCHEMA } from "@/entities/datalist-option";
import { isPopulatedArray } from "@/shared/libs";

export function DatalistOptionFormFields({
  control,
}: {
  control: Control<z.infer<typeof DATALIST_OPTION_SCHEMA>>;
}) {
  const dlWatched = useWatch({ control, name: "dataList" });
  const dlAdapter = useDatalistSelectAdapterWithFilters();
  const disabled = isPopulatedArray(dlWatched);

  const datalist: DataList = isPopulatedArray<DataList>(dlWatched)
    ? dlWatched[0]
    : (dlWatched as DataList);

  const {
    buildFilterFields: buildDatalistFilters,
    mapFiltersToPayload: mapDatalistFilters,
  } = useDatalistFilters();

  const datalistInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Datalist",
    adapter: dlAdapter,
    extraFilters: buildDatalistFilters(),
    mapExtraFilters: (filters) => mapDatalistFilters(filters),
    searchPlaceholder: "Search datalist...",
    selectPlaceholder: "Select datalist",
    multi: false,
    disabled,
  };

  return (
    <>
      <ComplexComboboxFormField
        control={control}
        name="dataList"
        info={datalistInfo}
      />

      <TextFormField control={control} name="name" label="Name" />

      <TextFormField control={control} name="icon" label="Icon" />

      {datalist?.attribute1 && (
        <TextFormField
          control={control}
          key="attribute1"
          name="attribute1"
          label={datalist?.attribute1.name ?? "Attribute 1"}
        />
      )}
      {datalist?.attribute2 && (
        <TextFormField
          control={control}
          key="attribute2"
          name="attribute2"
          label={datalist?.attribute2.name ?? "Attribute 2"}
        />
      )}
      {datalist?.attribute3 && (
        <TextFormField
          control={control}
          key="attribute3"
          name="attribute3"
          label={datalist?.attribute3.name ?? "Attribute 3"}
        />
      )}
      {datalist?.attribute4 && (
        <TextFormField
          control={control}
          key="attribute4"
          name="attribute4"
          label={datalist?.attribute4.name ?? "Attribute 4"}
        />
      )}
    </>
  );
}
