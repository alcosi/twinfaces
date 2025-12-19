import { TwinFlowTransition_DETAILED } from "@/entities/twin-flow-transition";
import { formatIntlDate, isPopulatedString, isUndefined } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";

import { PermissionResourceLink } from "../../../../features/permission/ui";
import { TwinClassStatusResourceLink } from "../../../../features/twin-status/ui";
import { UserResourceLink } from "../../../../features/user/ui";
import { TwinFlowTransitionIcon } from "../twin-flow-transition-icon";

type Props = {
  data: TwinFlowTransition_DETAILED;
  link: string;
};

export function TwinFlowTransitionResourceTooltip({ data, link }: Props) {
  if (isUndefined(data.id)) return null;

  return (
    <ResourceLinkTooltip uuid={data.id} link={link}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        subTitle={data.alias}
        iconSource={TwinFlowTransitionIcon}
      />

      <ResourceLinkTooltip.Main>
        {data.description && <p>{data.description}</p>}

        {data.srcTwinStatus && (
          <ResourceLinkTooltip.Item title="Source">
            <TwinClassStatusResourceLink data={data.srcTwinStatus} />
          </ResourceLinkTooltip.Item>
        )}

        {data.dstTwinStatus && (
          <ResourceLinkTooltip.Item title="Destination">
            <TwinClassStatusResourceLink data={data.dstTwinStatus} />
          </ResourceLinkTooltip.Item>
        )}

        {data.permission && (
          <ResourceLinkTooltip.Item title="Permission">
            <PermissionResourceLink data={data.permission} />
          </ResourceLinkTooltip.Item>
        )}

        {data.createdByUser && (
          <ResourceLinkTooltip.Item title="Created by">
            <UserResourceLink data={data.createdByUser} />
          </ResourceLinkTooltip.Item>
        )}

        {data.createdAt && (
          <ResourceLinkTooltip.Item title="Created at">
            {formatIntlDate(data.createdAt, "datetime-local")}
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
}
