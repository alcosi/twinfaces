import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";
import { UsersRound } from "lucide-react";
import { UserGroup } from "../../api";
import { ENTITY_COLOR } from "../../libs";

type Props = {
  data: UserGroup;
  link: string;
};

export function UserGroupResourceTooltip({ data, link }: Props) {
  return (
    <ResourceLinkTooltip uuid={data.id!} link={link} accentColor={ENTITY_COLOR}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        iconSource={UsersRound}
      />

      <ResourceLinkTooltip.Main>
        {data.description && <p>{data.description}</p>}

        {data.type && (
          <ResourceLinkTooltip.Item title="Type">
            <span className="truncate">{data.type}</span>
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
}
