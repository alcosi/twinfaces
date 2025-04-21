import { formatTwinDisplay } from "@/entities/twin";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { Twin } from "@/entities/twin/server";
import { formatToTwinfaceDate } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";

import { TwinClassResourceLink } from "../../../../features/twin-class/ui";
import { TwinClassStatusResourceLink } from "../../../../features/twin-status/ui";
import { UserResourceLink } from "../../../../features/user/ui";
import { TwinIcon } from "../twin-icon";

type Props = {
  data: Twin;
  link: string;
};

export function TwinResourceTooltip({ data, link }: Props) {
  return (
    <ResourceLinkTooltip uuid={data.id!} link={link}>
      <ResourceLinkTooltip.Header
        title={formatTwinDisplay(data)}
        iconSource={TwinIcon}
      />

      <ResourceLinkTooltip.Main>
        {data.description && <p>{data.description}</p>}
        {data.twinClass && (
          <ResourceLinkTooltip.Item title="Class">
            <TwinClassResourceLink
              data={data.twinClass as TwinClass_DETAILED}
            />
          </ResourceLinkTooltip.Item>
        )}
        {data.status && (
          <ResourceLinkTooltip.Item title="Status">
            <TwinClassStatusResourceLink
              data={data.status}
              twinClassId={data.twinClassId!}
            />
          </ResourceLinkTooltip.Item>
        )}
        {data.authorUser && (
          <ResourceLinkTooltip.Item title="Author">
            <UserResourceLink data={data.authorUser} />
          </ResourceLinkTooltip.Item>
        )}
        {data.assignerUser && (
          <ResourceLinkTooltip.Item title="Assigner">
            <UserResourceLink data={data.assignerUser} />
          </ResourceLinkTooltip.Item>
        )}
        {data.createdAt && (
          <ResourceLinkTooltip.Item title="Created at">
            {formatToTwinfaceDate(data.createdAt)}
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
}
