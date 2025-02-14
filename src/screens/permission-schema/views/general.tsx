import { GuidWithCopy } from "@/shared/ui/guid";
import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table";
import { useContext } from "react";
import { PermissionSchemaContext } from "@/features/permission-schema";
import { formatToTwinfaceDate } from "@/shared/libs";
import { UserResourceLink } from "@/entities/user";

export function PermissionSchemaGeneral() {
  const { schema } = useContext(PermissionSchemaContext);

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>
            <GuidWithCopy value={schema.id} variant="long" />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>{schema.name}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Description</TableCell>
          <TableCell>{schema.description}</TableCell>
        </TableRow>

        {schema.createdByUser && (
          <TableRow>
            <TableCell>Created By</TableCell>
            <TableCell>
              <UserResourceLink data={schema.createdByUser} withTooltip />
            </TableCell>
          </TableRow>
        )}

        {schema.businessAccount && (
          <TableRow>
            <TableCell>Business Account</TableCell>
            <TableCell>
              <GuidWithCopy value={schema.businessAccountId} variant="long" />
            </TableCell>
          </TableRow>
        )}

        <TableRow>
          <TableCell>Created at</TableCell>
          <TableCell>{formatToTwinfaceDate(schema.createdAt!)}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
