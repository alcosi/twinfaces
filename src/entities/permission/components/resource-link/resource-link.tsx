import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";
import { Key } from "lucide-react";
import { Permission } from "../../api";
import { PermissionResourceTooltip } from "./tooltip";

type Props = {
  data: Permission;
  disabled?: boolean;
  withTooltip?: boolean;
};

export const PermissionResourceLink = ({
  data,
  disabled,
  withTooltip,
}: Props) => {
  const link = `/permission/${data.id}`;

  return (
    <ResourceLink
      IconComponent={() => <Key className="h-4 w-4" />}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => <PermissionResourceTooltip data={data} link={link} />
          : undefined
      }
      getDisplayName={(data) =>
        isPopulatedString(data.name) ? data.name : data.key!
      }
      link={link}
    />
  );
};
