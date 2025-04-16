import { useContext } from "react";

import {
  TwinClassResourceLink,
  TwinClass_DETAILED,
} from "@/entities/twin-class";
import { InPlaceEditContextProvider } from "@/features/inPlaceEdit";
import { PermissionGroupContext } from "@/features/permission-group";
import {
  GuidWithCopy,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/ui";

export function PermissionGroupGeneral() {
  const { permissionGroup } = useContext(PermissionGroupContext);

  return (
    <InPlaceEditContextProvider>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell width={300}>ID</TableCell>
            <TableCell>
              <GuidWithCopy value={permissionGroup.id} variant="long" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Key</TableCell>
            <TableCell>{permissionGroup.key}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Class</TableCell>
            <TableCell>
              {permissionGroup.twinClass && (
                <TwinClassResourceLink
                  data={permissionGroup.twinClass as TwinClass_DETAILED}
                  withTooltip
                />
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>{permissionGroup.name}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell>{permissionGroup.description}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </InPlaceEditContextProvider>
  );
}
