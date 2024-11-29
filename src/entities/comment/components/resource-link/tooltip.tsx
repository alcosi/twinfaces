import { UserResourceLink } from "@/entities/user";
import { ResourceLinkTooltip } from "@/shared/ui";
import { MessageCircle } from "lucide-react";
import { Comment_DETAILED } from "../../api";
import { ENTITY_COLOR } from "../../libs";

type Props = {
  data: Comment_DETAILED;
  link: string;
};

export const CommentResourceTooltip = ({ data, link }: Props) => {
  return (
    <ResourceLinkTooltip uuid={data.id} link={link} accentColor={ENTITY_COLOR}>
      <ResourceLinkTooltip.Header
        title={data.text}
        iconSource={MessageCircle}
      />

      <ResourceLinkTooltip.Main>
        <p>{data.text}</p>

        {data.authorUser && (
          <ResourceLinkTooltip.Item title="Author">
            <UserResourceLink data={data.authorUser} />
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
};
