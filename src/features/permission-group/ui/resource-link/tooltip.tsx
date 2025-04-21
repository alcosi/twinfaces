import { PermissionGroup } from "@/entities/permission-group";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";

import { TwinClassResourceLink } from "../../../../features/twin-class/ui";
import { PermissionGroupIcon } from "../permission-group-icon";

type Props = {
  data: PermissionGroup;
  link: string;
};

export function PermissionGroupResourceTooltip({ data, link }: Props) {
  return (
    <ResourceLinkTooltip uuid={data.id!} link={link}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        subTitle={data.key}
        iconSource={PermissionGroupIcon}
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
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
}
