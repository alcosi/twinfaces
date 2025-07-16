import { UsersRound } from "lucide-react";

import { UserGroup } from "@/entities/user-group";
import { isPopulatedString, isUndefined } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";

import { UserGroupResourceTooltip } from "./tooltip";

type Props = {
  data: UserGroup;
  disabled?: boolean;
  withTooltip?: boolean;
};

export const UserGroupResourceLink = ({
  data,
  disabled,
  withTooltip,
}: Props) => {
  if (isUndefined(data)) return null;

  const link = `/under-construction`;

  return (
    <ResourceLink
      IconComponent={() => <UsersRound className="h-4 w-4" />}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => <UserGroupResourceTooltip data={data} link={link} />
          : undefined
      }
      getDisplayName={(data) =>
        isPopulatedString(data.name) ? data.name : "N/A"
      }
      link={link}
    />
  );
};
