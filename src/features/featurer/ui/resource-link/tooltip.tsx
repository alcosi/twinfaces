"use client";

import { Play } from "lucide-react";

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
// eslint-disable-next-line fsd-import/layer-imports
import { FeaturerParamValueLink } from "@/widgets/featurer-params";

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
                    // The href a bare uuid still falls back to, for a reference
                    // the response did not decode.
                    const links = getFeaturerLinks(param.type, param.value);
                    const hrefById = new Map(
                      links.map((link) => [link.id, link.href])
                    );

                    return (
                      <TableRow key={idx} className="hover:bg-muted/50">
                        <TableCell
                          className="px-2 py-1 font-medium"
                          title={param.type}
                        >
                          {param.key}
                        </TableCell>
                        <TableCell className="px-2 py-1 break-all">
                          {isPopulatedArray(param.values) ? (
                            <div className="flex flex-col items-start gap-1">
                              {param.values.map((value) => (
                                <FeaturerParamValueLink
                                  key={value.id}
                                  value={value}
                                  href={hrefById.get(value.id)}
                                />
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
