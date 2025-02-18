import {
  TwinClass_DETAILED,
  TwinClassResourceLink,
} from "@/entities/twin-class";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";
import { BookKey } from "lucide-react";
import { PermissionGroup } from "../../api";

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
        iconSource={BookKey}
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
