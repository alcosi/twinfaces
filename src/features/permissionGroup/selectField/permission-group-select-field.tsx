import { ComboboxFormField } from "@/components/form-fields/combobox";
import { TextFormItem } from "@/components/form-fields/text-form-field";
import {
  PermissionGroup_DETAILED,
  useFetchPermissionGroupById,
  usePermissionGroupSearchV1,
} from "@/entities/permissionGroup";
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
  const [permissionGroup, setPermissionGroup] =
    useState<PermissionGroup_DETAILED>();

  useEffect(() => {
    if (props.disabled && permissionGroupId) {
      fetchPermissionGroupById(permissionGroupId).then(setPermissionGroup);
    }
  }, [props.disabled, permissionGroupId, fetchPermissionGroupById]);

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

  // TODO: to refactor after https://alcosi.atlassian.net/browse/TWINFACES-76
  return props.disabled ? (
    <TextFormItem
      {...props}
      placeholder="Group..."
      value={
        permissionGroup?.key
          ? `${permissionGroup?.key}${permissionGroup?.name ? ` (${permissionGroup?.name})` : ""}`
          : undefined
      }
    />
  ) : (
    <ComboboxFormField
      getById={getById}
      getItems={getItems}
      getItemKey={(item) => item.id!}
      getItemLabel={({ key = "", name }) => `${key}${name ? ` (${name})` : ""}`}
      selectPlaceholder="Select permission group"
      searchPlaceholder="Search permission group..."
      noItemsText={"No classes found"}
      {...props}
    />
  );
}
