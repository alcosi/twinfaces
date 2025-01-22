import { ComboboxFormField } from "@/components/form-fields/combobox";
import { FormFieldProps } from "@/components/form-fields/types";
import {
  TwinStatus,
  useFetchTwinStatusById,
  useTwinStatusSelectAdapter,
} from "@/entities/twin-status";
import { useEffect, useState } from "react";
import { Control, FieldValues, Path, useWatch } from "react-hook-form";

type Props<T extends FieldValues> = {
  twinClassId?: string;
  control: Control<T>;
  name: Path<T>;
  label: string;
} & FormFieldProps<T>;

export function TwinStatusSelectField<T extends FieldValues>(props: Props<T>) {
  const sAdapter = useTwinStatusSelectAdapter(props.twinClassId);
  const { fetchTwinStatusById } = useFetchTwinStatusById();
  const statusId = useWatch({
    control: props.control,
    name: props.name,
  });
  // TODO: Refactor after TWINFACES-207 - Combobox/select should fetch object value from field ID.
  const [initVals, setInitVals] = useState<TwinStatus[]>([]);

  useEffect(() => {
    if (statusId) {
      fetchTwinStatusById(statusId).then((data) => setInitVals([data]));
    }
  }, [statusId]);

  return (
    <ComboboxFormField
      {...sAdapter}
      selectPlaceholder="Select status"
      searchPlaceholder="Search status..."
      noItemsText={"No statuses found"}
      initialValues={initVals}
      {...props}
    />
  );
}
