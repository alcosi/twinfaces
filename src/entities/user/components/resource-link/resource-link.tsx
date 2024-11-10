import { isPopulatedString, isUndefined } from "@/shared/libs";
import { Avatar, ResourceLink } from "@/shared/ui";
import { User as UserIcon } from "lucide-react";
import { User } from "../../libs";
import { UserResourceTooltip } from "./tooltip";

type Props = {
  data: User;
  disabled?: boolean;
  withTooltip?: boolean;
};

export const UserResourceLink = ({ data, disabled, withTooltip }: Props) => {
  if (isUndefined(data)) return null;

  const link = `/twin`;

  return (
    <ResourceLink
      IconComponent={() =>
        data?.avatar ? (
          <Avatar url={data.avatar} size="sm" />
        ) : (
          <UserIcon className="h-4 w-4" />
        )
      }
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => <UserResourceTooltip data={data} link={link} />
          : undefined
      }
      getDisplayName={(data) =>
        isPopulatedString(data.fullName) ? data.fullName : "N/A"
      }
      link={link}
    />
  );
};
