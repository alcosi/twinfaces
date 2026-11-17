"use client";

import { Play } from "lucide-react";

import { Featurer_DETAILED } from "@/entities/featurer";
import { isPopulatedArray, isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";
import { EntityCardChips } from "@/shared/ui/entity-card";
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
        {data.description && (
          <p className="text-xs break-words">{data.description}</p>
        )}
        {data.id && (
          <ResourceLinkTooltip.Item title="Id">
            {data.id}
          </ResourceLinkTooltip.Item>
        )}
        {!hasParams && (
          <ResourceLinkTooltip.Item title="Params">
            N/A
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>

      {/* One section per parameter, named after it: a value that points at
          entities is a list of their links — folding past a few, like any
          card's list — and anything else is shown as it came. */}
      {hasParams &&
        params.map((param) => {
          const links = getFeaturerLinks(param.type, param.value);
          // The href a bare uuid still falls back to, for a reference the
          // response did not decode.
          const hrefById = new Map(links.map((link) => [link.id, link.href]));
          const values = param.values ?? [];

          return (
            <ResourceLinkTooltip.Section
              key={param.key}
              label={param.key}
              hint={param.type}
              count={values.length > 1 ? values.length : undefined}
            >
              {values.length > 0 ? (
                <EntityCardChips
                  items={values}
                  getKey={(value) => value.id}
                  renderItem={(value) => (
                    <FeaturerParamValueLink
                      value={value}
                      href={hrefById.get(value.id)}
                    />
                  )}
                />
              ) : (
                <div className="text-foreground text-xs break-all">
                  {param.value || "N/A"}
                </div>
              )}
            </ResourceLinkTooltip.Section>
          );
        })}
    </ResourceLinkTooltip>
  );
}
