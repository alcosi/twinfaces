import { TwinClassContext } from "@/app/twinclass/[twinClassId]/twin-class-context";
import { Badge } from "@/components/base/badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/base/table";
import { TwinClassResourceLink } from "@/entities/twinClass";
import { TwinClassLinkResourceLink } from "@/entities/twinClassLink/components";
import { TwinClassLink } from "@/lib/api/api-types";
import { useContext } from "react";

export function GeneralSection() {
  const { twinClass, linkId, relatedObjects } = useContext(TwinClassContext);

  if (!linkId || !twinClass) return null;

  const link: TwinClassLink | undefined =
    twinClass.forwardLinkMap?.[linkId] || twinClass.backwardLinkMap?.[linkId];
  const isForwardLink = Boolean(twinClass.forwardLinkMap?.[linkId]);

  return link ? (
    <>
      <h2 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
        General
      </h2>

      <Table className="mt-8">
        <TableBody>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>
              <TwinClassLinkResourceLink data={link} disabled />
            </TableCell>
          </TableRow>
          {link.dstTwinClassId && (
            <TableRow>
              <TableCell>
                {isForwardLink ? "Destination Twin Class" : "Source Twin Class"}
              </TableCell>
              <TableCell>
                {/* <TwinClassResourceLink data={destTwinClass} withTooltip /> */}
                <TwinClassResourceLink
                  data={
                    relatedObjects?.twinClassMap?.[link.dstTwinClassId] || {
                      id: link.dstTwinClassId,
                    }
                  }
                  withTooltip
                />
              </TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>{link.name}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>
              <Badge variant="outline" key={link.type}>
                {link.type}
              </Badge>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Link Strength</TableCell>
            <TableCell>
              <Badge variant="outline" key={link.linkStrengthId}>
                {link.linkStrengthId}
              </Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  ) : null;
}
