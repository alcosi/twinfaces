import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";
import { PermissionSchema } from "../../api";
import { PermissionSchemaIcon } from "../permission-schema-icon";

type Props = {
  data: PermissionSchema;
  link: string;
};

export function PermissionSchemaResourceTooltip({ data, link }: Props) {
  return (
    <ResourceLinkTooltip uuid={data.id!} link={link}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        iconSource={PermissionSchemaIcon}
      />

      <ResourceLinkTooltip.Main>
        {data.description && (
          <ResourceLinkTooltip.Item title="Description">
            {data.description}
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
}
