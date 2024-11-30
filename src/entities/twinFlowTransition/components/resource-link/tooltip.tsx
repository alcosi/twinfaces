import { PermissionResourceLink } from "@/entities/permission";
import { TwinClassStatusResourceLink } from "@/entities/twinStatus";
import { UserResourceLink } from "@/entities/user";
import { isPopulatedString, isUndefined } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";
import { ArrowRightLeft } from "lucide-react";
import { TwinFlowTransition_DETAILED } from "../../api";
import { ENTITY_COLOR } from "../../libs";

type Props = {
  data: TwinFlowTransition_DETAILED;
  link: string;
  twinClassId: string;
};

export function TwinFlowTransitionResourceTooltip({
  data,
  link,
  twinClassId,
}: Props) {
  if (isUndefined(data.id)) return null;

  return (
    <ResourceLinkTooltip uuid={data.id} link={link} accentColor={ENTITY_COLOR}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        subTitle={data.alias}
        iconSource={ArrowRightLeft}
      />

      <ResourceLinkTooltip.Main>
        {data.description && <p>{data.description}</p>}

        {data.srcTwinStatus && (
          <ResourceLinkTooltip.Item title="Source">
            <TwinClassStatusResourceLink
              data={data.srcTwinStatus}
              twinClassId={twinClassId}
            />
          </ResourceLinkTooltip.Item>
        )}

        {data.dstTwinStatus && (
          <ResourceLinkTooltip.Item title="Destination">
            <TwinClassStatusResourceLink
              data={data.dstTwinStatus}
              twinClassId={twinClassId}
            />
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
            {new Date(data.createdAt).toLocaleDateString()}
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
}
