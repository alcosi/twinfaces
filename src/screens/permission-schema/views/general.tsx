import { UserResourceLink } from "@/entities/user";
import { PermissionSchemaContext } from "@/features/permission-schema";
import { formatToTwinfaceDate } from "@/shared/libs";
import {
  GuidWithCopy,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/ui";
import { useContext } from "react";

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
          <TableCell>
            {schema.createdAt && formatToTwinfaceDate(schema.createdAt)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
