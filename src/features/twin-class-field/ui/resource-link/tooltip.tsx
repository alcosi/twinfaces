import { ReactNode } from "react";

import { TwinClassField_DETAILED } from "@/entities/twin-class-field";
import { isPopulatedString } from "@/shared/libs";
import { GuidWithCopy, ResourceLinkTooltip } from "@/shared/ui";

import { FieldIcon } from "../field-icon";

type Props = {
  data: TwinClassField_DETAILED;
  link: string;
  actions?: ReactNode;
};

export function TwinClassFieldResourceTooltip({ data, link, actions }: Props) {
  return (
    <ResourceLinkTooltip uuid={data.id} link={link} actions={actions}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        subTitle={data.key}
        iconSource={FieldIcon}
      />

      <ResourceLinkTooltip.Main>
        {data.description && <p>{data.description}</p>}

        {data.twinClassId && (
          <ResourceLinkTooltip.Item title="Class Id">
            <GuidWithCopy value={data.twinClassId} />
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
}
