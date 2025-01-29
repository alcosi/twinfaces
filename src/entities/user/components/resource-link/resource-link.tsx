import { isPopulatedString, isUndefined } from "@/shared/libs";
import { Avatar, ResourceLink } from "@/shared/ui";
import { User as UserIcon } from "lucide-react";
import { UserResourceTooltip } from "./tooltip";
import { User } from "../../api";

type Props = {
  data: User;
  disabled?: boolean;
  withTooltip?: boolean;
  withoutAvatar?: boolean;
};

export const UserResourceLink = ({ data, disabled, withTooltip, withoutAvatar = false }: Props) => {
  if (isUndefined(data)) return null;

  const link = `/under-construction`;

  return (
    <ResourceLink
      IconComponent={() =>
        withoutAvatar ? undefined : data?.avatar ? (
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
      withoutAvatar= {withoutAvatar}
    />
  );
};
