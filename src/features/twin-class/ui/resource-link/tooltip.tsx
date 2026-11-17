import { ReactNode } from "react";

import { TwinClass_DETAILED } from "@/entities/twin-class";
import { ResourceLinkTooltip } from "@/shared/ui";
import { EntityCardSections } from "@/shared/ui/entity-card";

import {
  TWIN_CLASS_CARD_PRESETS,
  getTwinClassCardHeader,
  twinClassCardSections,
} from "../card";

type Props = {
  data: TwinClass_DETAILED;
  link: string;
  actions?: ReactNode;
};

export function TwinClassResourceTooltip({ data, link, actions }: Props) {
  const header = getTwinClassCardHeader(data);

  return (
    <ResourceLinkTooltip uuid={data.id} link={link} actions={actions}>
      <ResourceLinkTooltip.Header
        title={header.title}
        subTitle={header.subtitle}
        iconSource={header.icon}
      />

      <EntityCardSections
        entity={data}
        registry={twinClassCardSections}
        preset={TWIN_CLASS_CARD_PRESETS.tooltip}
      />
    </ResourceLinkTooltip>
  );
}
