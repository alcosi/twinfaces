import { GuidWithCopy } from "@/shared/ui/guid";
import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table";
import { PermissionContext } from "@/features/permission";
import { useContext } from "react";
import { UserGroupResourceLink } from "@/entities/userGroup";
import { toast } from "sonner";
import {
  UpdatePermissionRequestBody,
  usePermissionUpdate,
} from "@/entities/permission";
import {
  InPlaceEdit,
  InPlaceEditContextProvider,
  InPlaceEditProps,
} from "@/features/inPlaceEdit";
import { AutoFormValueType } from "@/components/auto-field";
import { z } from "zod";
import { usePermissionGroupSelectAdapter } from "@/entities/permissionGroup";

export function GeneralSection() {
  const { permission, refresh } = useContext(PermissionContext);
  const { updatePermission } = usePermissionUpdate();
  const pgAdapter = usePermissionGroupSelectAdapter();

  async function update(newPermission: UpdatePermissionRequestBody) {
    try {
      await updatePermission({
        permissionId: permission.id,
        body: newPermission,
      });
      toast.success("Permission update successfully!");
      refresh?.();
    } catch (e) {
      toast.error("Failed to update Permission");
    }
  }

  const keySettings: InPlaceEditProps = {
    id: "key",
    value: permission.key,
    valueInfo: {
      type: AutoFormValueType.string,
      label: "",
      inputProps: {
        fieldSize: "sm",
      },
    },
    schema: z.string().min(1),
    onSubmit: (value) => {
      return update({
        key: value as string,
      });
    },
  };

  const groupIdSettings: InPlaceEditProps<any> = {
    id: "groupId",
    value: permission.groupId,
    valueInfo: {
      type: AutoFormValueType.combobox,
      selectPlaceholder: "Select permission group...",
      ...pgAdapter,
    },
    renderPreview: permission.groupId
      ? (_) => <UserGroupResourceLink data={permission.group} />
      : undefined,
    onSubmit: async (value) => {
      return update({ groupId: value[0].id });
    },
  };

  const nameSettings: InPlaceEditProps = {
    id: "name",
    value: permission.name,
    valueInfo: {
      type: AutoFormValueType.string,
      label: "",
      inputProps: {
        fieldSize: "sm",
      },
    },
    schema: z.string().min(1),
    onSubmit: (value) => {
      return update({
        nameI18n: { translationInCurrentLocale: value as string },
      });
    },
  };

  const descriptionSettings: InPlaceEditProps = {
    id: "description",
    value: permission.description,
    valueInfo: {
      type: AutoFormValueType.string,
      inputProps: {
        fieldSize: "sm",
      },
      label: "",
    },
    schema: z.string().min(1),
    onSubmit: (value) => {
      return update({
        descriptionI18n: { translationInCurrentLocale: value as string },
      });
    },
  };

  return (
    <InPlaceEditContextProvider>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>
              <GuidWithCopy value={permission.id} variant="long" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Key</TableCell>
            <TableCell>
              <InPlaceEdit {...keySettings} />
            </TableCell>
          </TableRow>

          {permission.group && (
            <TableRow>
              <TableCell>Group</TableCell>
              <TableCell>
                <InPlaceEdit {...groupIdSettings} />
              </TableCell>
            </TableRow>
          )}

          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>
              <InPlaceEdit {...nameSettings} />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell>
              <InPlaceEdit {...descriptionSettings} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </InPlaceEditContextProvider>
  );
}
