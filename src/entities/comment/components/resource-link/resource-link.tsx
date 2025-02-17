import { ResourceLink } from "@/shared/ui";
import { MessageCircle } from "lucide-react";
import { Comment_DETAILED } from "../../api";
import { CommentResourceTooltip } from "./tooltip";

type Props = {
  data: Comment_DETAILED;
  disabled?: boolean;
  withTooltip?: boolean;
};

export const CommentResourceLink = ({ data, disabled, withTooltip }: Props) => {
  const link = `/worskpace/comment/${data.id}`;

  return (
    <ResourceLink
      IconComponent={MessageCircle}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => <CommentResourceTooltip data={data} link={link} />
          : undefined
      }
      getDisplayName={(data) => data.text}
      link={link}
    />
  );
};
