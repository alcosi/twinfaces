import { Hash } from "lucide-react";

import { FieldAttribute } from "@/entities/twinField";
import { formatIntlDate, isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";

type Props = {
  data: FieldAttribute;
  link: string;
};

export enum TwinClassFieldAttributeId {
  CONFLICTED = "7b0ec2ea-c289-472d-ab72-1013aab2defa",
  PROJECTION_ERROR = "ced28d0d-a6b5-4d9d-82e6-0c4085d6a256",
  PROJECTION_EXCLUSION = "bf3af07c-15d5-46b6-b271-6ee16e41a2cb",
  AI_IN_PROGRESS = "f7d782cc-4405-4673-b623-3c715ccffeb2",
}

export const TwinClassFieldAttributeIdLabelMap: Record<
  TwinClassFieldAttributeId,
  string
> = {
  [TwinClassFieldAttributeId.CONFLICTED]: "Conflicted",
  [TwinClassFieldAttributeId.PROJECTION_ERROR]: "Projection error",
  [TwinClassFieldAttributeId.PROJECTION_EXCLUSION]: "Projection exclusion",
  [TwinClassFieldAttributeId.AI_IN_PROGRESS]: "AI in progress",
};

export function TwinFieldAttributeResourceTooltip({ data, link }: Props) {
  return (
    <ResourceLinkTooltip uuid={data.id!} link={link}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.id) ? data.id : "N/A"}
        iconSource={<Hash size={35} />}
      />

      <ResourceLinkTooltip.Main>
        {data.twinClassFieldAttributeId && (
          <ResourceLinkTooltip.Item title="Attribute">
            {TwinClassFieldAttributeIdLabelMap[
              data.twinClassFieldAttributeId as TwinClassFieldAttributeId
            ] ?? data.twinClassFieldAttributeId}
          </ResourceLinkTooltip.Item>
        )}

        {isPopulatedString(data.noteMsg) && (
          <ResourceLinkTooltip.Item title="Note">
            {data.noteMsg}
          </ResourceLinkTooltip.Item>
        )}

        {data.changedAt && (
          <ResourceLinkTooltip.Item title="Changed">
            {formatIntlDate(data.changedAt, "datetime-local")}
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
}
