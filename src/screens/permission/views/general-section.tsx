import { ShortGuidWithCopy } from "@/components/base/short-guid";
import { Table, TableBody, TableCell, TableRow } from "@/components/base/table";
import { PermissionContext } from "@/features/permission";
import { useContext } from "react";

export function GeneralSection() {
  const { permission } = useContext(PermissionContext);

  return permission ? (
    <Table className="mt-8">
      <TableBody>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>
            <ShortGuidWithCopy value={permission.id} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Key</TableCell>
          <TableCell>{permission.key}</TableCell>
        </TableRow>
        {permission.group && (
          <TableRow>
            <TableCell>Group</TableCell>
            <TableCell>{permission.group.name}</TableCell>
          </TableRow>
        )}
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>{permission.name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Description</TableCell>
          <TableCell>{permission.description}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ) : null;
}
