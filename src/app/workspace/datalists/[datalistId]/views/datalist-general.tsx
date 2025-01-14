import React, { useContext } from "react";
import { DatalistContext } from "../datalist-context";
import {
  GuidWithCopy,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/ui";

export function DatalistGeneral() {
  const { datalist } = useContext(DatalistContext);

  if (!datalist) {
    console.error("DatalistGeneral: no datalist");
    return;
  }

  return (
    <Table className="mt-8">
      <TableBody>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>
            <GuidWithCopy value={datalist?.id} variant="long" />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>{datalist?.name}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Description</TableCell>
          <TableCell>{datalist?.description}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Updated at</TableCell>
          <TableCell>
            {new Date(datalist?.updatedAt!).toLocaleDateString()}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
