import React, { useContext, useEffect } from "react";
import { DatalistContext } from "../datalist-context";
import {
  ShortGuidWithCopy,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/ui";
import { useBreadcrumbs } from "@/features/breadcrumb";

export function DatalistGeneral() {
  const { datalist, datalistId } = useContext(DatalistContext);
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Datalists", href: "/datalists" },
      {
        label: datalist?.name!,
        href: `/datalists/${datalistId}`,
      },
    ]);
  }, [datalistId, datalist?.name]);

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
            <ShortGuidWithCopy value={datalist?.id} />
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
