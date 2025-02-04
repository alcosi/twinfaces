import { TextFormField } from "@/components/form-fields";
import { Control, useWatch } from "react-hook-form";
import { ComboboxFormField } from "@/components/form-fields/combobox";
import {
  useDatalistSelectAdapter,
  useFetchDatalistById,
} from "@/entities/datalist";
import { z } from "zod";
import {
  DATALIST_OPTION_SCHEMA,
  FormFieldNames,
} from "@/entities/datalist-option";
import { isPopulatedString } from "@/shared/libs";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function DatalistOptionFormFields({
  control,
  setAttributeNames,
}: {
  control: Control<z.infer<typeof DATALIST_OPTION_SCHEMA>>;
  setAttributeNames: (names: string[]) => void;
}) {
  const dataListID = useWatch({ control, name: "dataListId" });
  const dlAdapter = useDatalistSelectAdapter();
  const { fetchDatalistById } = useFetchDatalistById();

  const id = Array.isArray(dataListID) ? dataListID[0].id : dataListID;
  const [countAttributes, setCountAttributes] = useState<string[]>([]);

  useEffect(() => {
    const fetchDatalist = async () => {
      if (!id) return;

      try {
        const response = await fetchDatalistById({
          dataListId: id,
          query: { showDataListMode: "MANAGED" },
        });

        const dataList = response;

        if (dataList) {
          const attributes = Object.keys(dataList)
            .filter((key) => key.startsWith("attribute"))
            .map(
              (key) => (dataList as unknown as Record<string, any>)[key]?.key
            );

          setCountAttributes(attributes);
          setAttributeNames(attributes);
        }
      } catch (error) {
        toast.error("Failed to fetch datalist");
      }
    };

    fetchDatalist();
  }, [id]);

  return (
    <>
      <ComboboxFormField
        control={control}
        name="dataListId"
        label="Datalist"
        selectPlaceholder="Select datalist"
        searchPlaceholder="Search datalist..."
        noItemsText="No datalist found"
        disabled={isPopulatedString(dataListID)}
        {...dlAdapter}
      />

      <TextFormField control={control} name="name" label="Name" />

      <TextFormField control={control} name="icon" label="Icon" />

      {countAttributes.map((name, index) => (
        <TextFormField
          key={index}
          control={control}
          name={`attribute${index + 1}` as FormFieldNames}
          label={name ?? `Attribute ${index + 1}`}
        />
      ))}
    </>
  );
}
