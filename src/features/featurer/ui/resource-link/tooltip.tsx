import { Play } from "lucide-react";

import { Featurer_DETAILED } from "@/entities/featurer";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

type Props = {
  data: Featurer_DETAILED;
  link: string;
  params?: Record<string, unknown>;
};

export function FeaturerResourceTooltip({ data, link, params }: Props) {
  const paramsEntries = params ? Object.entries(params) : [];
  const hasParams = paramsEntries.length > 0;

  return (
    <ResourceLinkTooltip uuid={`${data.id}`} link={link}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        iconSource={Play}
      />

      <ResourceLinkTooltip.Main>
        {data.id && <p className="text-xs">{`Id: ${data.id}`}</p>}
        {data.description && <p className="text-xs">{data.description}</p>}

        {!hasParams ? (
          <p className="text-xs font-semibold">Params: N/A</p>
        ) : (
          <>
            <p className="text-xs font-semibold">Params:</p>
            <div className="overflow-hidden">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow>
                    <TableHead className="h-8 px-2 py-1">Name</TableHead>
                    <TableHead className="h-8 px-2 py-1">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paramsEntries.map(([key, value], idx) => (
                    <TableRow key={idx} className="hover:bg-muted/50">
                      <TableCell className="px-2 py-1 font-medium">
                        {key}
                      </TableCell>
                      <TableCell className="px-2 py-1">
                        {String(value) || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
}
