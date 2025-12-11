import { useContext } from "react";

import { InPlaceEditContextProvider } from "@/features/inPlaceEdit";
import { ProjectionContext } from "@/features/projection";
import {
  GuidWithCopy,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/ui";

export function ProjectionGeneral() {
  const { projection } = useContext(ProjectionContext);
  return (
    <InPlaceEditContextProvider>
      <Table className="mt-8">
        <TableBody>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>
              <GuidWithCopy value={projection.id} variant="long" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </InPlaceEditContextProvider>
  );
}
