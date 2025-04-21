import { MessageCircle } from "lucide-react";

import { Comment_DETAILED } from "@/entities/comment";
import { formatToTwinfaceDate } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";

import { UserResourceLink } from "../../../../features/user/ui";

type Props = {
  data: Comment_DETAILED;
  link: string;
};

export const CommentResourceTooltip = ({ data, link }: Props) => {
  return (
    <ResourceLinkTooltip uuid={data.id} link={link}>
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
            {formatToTwinfaceDate(data.createdAt)}
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
};
