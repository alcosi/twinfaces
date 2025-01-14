import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table";
import { GuidWithCopy } from "@/shared/ui";
import { InPlaceEditContextProvider } from "@/features/inPlaceEdit";
import { DataListOptionV1 } from "@/entities/option";

export function DatalistOptionGeneral({
  datalistOption,
}: {
  datalistOption: DataListOptionV1;
}) {
  const attributeKeys = Object.keys(datalistOption.attributes || {});

  return (
    <InPlaceEditContextProvider>
      <Table className="mt-8">
        <TableBody>
          <TableRow>
            <TableCell width={300}>ID</TableCell>
            <TableCell>
              <GuidWithCopy value={datalistOption.id} variant="long" />
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>{datalistOption.name}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Icon</TableCell>
            <TableCell>{datalistOption.icon}</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>Disabled</TableCell>
            <TableCell>{datalistOption.disabled}</TableCell>
          </TableRow>

          {attributeKeys.map((key) => (
            <TableRow key={key} className="cursor-pointer">
              <TableCell>{key}</TableCell>
              <TableCell>{datalistOption.attributes?.[key]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </InPlaceEditContextProvider>
  );
}
