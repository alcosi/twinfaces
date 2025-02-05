import { TextFormField } from "@/components/form-fields";
import { ComboboxFormField } from "@/components/form-fields/combobox";
import { DataList, useDatalistSelectAdapter } from "@/entities/datalist";
import { DATALIST_OPTION_SCHEMA } from "@/entities/datalist-option";
import { isPopulatedArray } from "@/shared/libs";
import { Control, useWatch } from "react-hook-form";
import { z } from "zod";

export function DatalistOptionFormFields({
  control,
}: {
  control: Control<z.infer<typeof DATALIST_OPTION_SCHEMA>>;
}) {
  const dlWatched = useWatch({ control, name: "dataListId" });
  const dlAdapter = useDatalistSelectAdapter();

  const datalist: DataList = isPopulatedArray<DataList>(dlWatched)
    ? dlWatched[0]
    : dlWatched;

  console.log("foobar controll", {
    dlWatched,
  });
  return (
    <>
      <ComboboxFormField
        control={control}
        name="dataListId"
        label="Datalist"
        selectPlaceholder="Select datalist"
        searchPlaceholder="Search datalist..."
        noItemsText="No datalist found"
        disabled={!isPopulatedArray(dlWatched)}
        {...dlAdapter}
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
