import { isFullString } from "@/shared/libs";
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
        withTooltip ? (data) => <UserResourceTooltip data={data} /> : undefined
      }
      getDisplayName={(data) =>
        isFullString(data?.fullName) ? data.fullName : "N/A"
      }
      getLink={() => `/twin`}
    />
  );
};
