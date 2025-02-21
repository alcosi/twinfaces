import { ComboboxFormField, TextFormItem } from "@/components/form-fields";
import {
  PermissionGroup_DETAILED,
  useFetchPermissionGroupById,
  usePermissionGroupSearchV1,
} from "@/entities/permission-group";
import { useEffect, useState } from "react";
import { Control, FieldValues, Path, useWatch } from "react-hook-form";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  disabled?: boolean;
};

export function PermissionGroupSelectField<T extends FieldValues>(
  props: Props<T>
) {
  const { fetchPermissionGroupById } = useFetchPermissionGroupById();
  const { searchPermissionGroups } = usePermissionGroupSearchV1();
  const permissionGroupId = useWatch({
    control: props.control,
    name: props.name,
  });
  // TODO: Refactor after TWINFACES-207 - Combobox/select should fetch object value from field ID.
  const [initVals, setInitVals] = useState<PermissionGroup_DETAILED[]>([]);

  useEffect(() => {
    if (permissionGroupId) {
      fetchPermissionGroupById(permissionGroupId).then((data) =>
        setInitVals([data])
      );
    }
  }, [permissionGroupId, fetchPermissionGroupById]);

  async function getById(id: string) {
    return await fetchPermissionGroupById(id);
  }

  async function getItems(search: string): Promise<PermissionGroup_DETAILED[]> {
    try {
      const { data } = await searchPermissionGroups({ search });
      return data;
    } catch (error) {
      console.error("Error fetching search items:", error);
      return [];
    }
  }

  // TODO: Refactor after TWINFACES-207 - Combobox/select should fetch object value from field ID.
  return (
    <ComboboxFormField
      getById={getById}
      getItems={getItems}
      renderItem={({ key = "", name }) => `${key}${name ? ` (${name})` : ""}`}
      selectPlaceholder="Select permission group"
      searchPlaceholder="Search permission group..."
      noItemsText={"No permission groups found"}
      initialValues={initVals}
      {...props}
    />
  );
}
