import { User as UserIcon } from "lucide-react";

import { User } from "@/entities/user";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString, isUndefined } from "@/shared/libs";
import { Avatar, ResourceLink } from "@/shared/ui";

import { UserResourceTooltip } from "./tooltip";

type Props = {
  data: User;
  disabled?: boolean;
  withTooltip?: boolean;
  hideAvatar?: boolean;
};

export const UserResourceLink = ({
  data,
  disabled,
  withTooltip,
  hideAvatar = false,
}: Props) => {
  if (isUndefined(data)) return null;

  const link = `/${PlatformArea.core}/users/${data.id}`;

  return (
    <ResourceLink
      IconComponent={() =>
        hideAvatar ? undefined : data?.avatar ? (
          <Avatar url={data.avatar} size="sm" className="rounded-full" />
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
      hideIcon={hideAvatar}
    />
  );
};
