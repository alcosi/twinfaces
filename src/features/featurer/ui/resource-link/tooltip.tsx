"use client";

import { Play } from "lucide-react";
import Link from "next/link";

import { Featurer_DETAILED } from "@/entities/featurer";
import { isPopulatedArray, isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

import { ExtendedFeaturerParam, getFeaturerLinks } from "../../utils/helpers";

type Props = {
  data: Featurer_DETAILED;
  link: string;
  params?: ExtendedFeaturerParam[];
};

export function FeaturerResourceTooltip({ data, link, params }: Props) {
  const hasParams = isPopulatedArray(params);

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
          <p className="text-xs">Params: N/A</p>
        ) : (
          <>
            <p className="text-xs font-semibold">Params:</p>
            <div className="overflow-hidden">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow>
                    <TableHead className="h-8 px-2 py-1">Key</TableHead>
                    <TableHead className="h-8 px-2 py-1">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {params.map((param, idx) => {
                    const links = getFeaturerLinks(param.type, param.value);

                    return (
                      <TableRow key={idx} className="hover:bg-muted/50">
                        <TableCell
                          className="px-2 py-1 font-medium"
                          title={param.type}
                        >
                          {param.key}
                        </TableCell>
                        <TableCell className="px-2 py-1 break-all">
                          {links.length > 0 ? (
                            <div className="space-y-1">
                              {links.map((link, linkIdx) => (
                                <div key={linkIdx}>
                                  <Link
                                    href={link.href}
                                    className="text-blue-500 hover:text-blue-700 hover:underline"
                                    rel="noopener noreferrer"
                                  >
                                    {link.id}
                                  </Link>
                                </div>
                              ))}
                            </div>
                          ) : (
                            param.value || "N/A"
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
}
