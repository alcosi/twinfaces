import { TwinClassStatusResourceLink } from "@/entities/twin-status";
import {
  TwinClass_DETAILED,
  TwinClassResourceLink,
} from "@/entities/twinClass";
import { UserResourceLink } from "@/entities/user";
import { ResourceLinkTooltip } from "@/shared/ui";
import { Braces } from "lucide-react";
import { Twin } from "../../api";
import { formatTwinDisplay } from "../../libs";

type Props = {
  data: Twin;
  link: string;
};

export function TwinResourceTooltip({ data, link }: Props) {
  return (
    <ResourceLinkTooltip uuid={data.id!} link={link}>
      <ResourceLinkTooltip.Header
        title={formatTwinDisplay(data)}
        iconSource={Braces}
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
            {new Date(data.createdAt).toLocaleDateString()}
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
}
