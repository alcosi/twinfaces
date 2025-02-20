import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";
import { PermissionGroup } from "../../api";
import { PermissionGroupIcon } from "../permission-group-icon";
import { PermissionGroupResourceTooltip } from "./tooltip";

type Props = {
  data: PermissionGroup;
  disabled?: boolean;
  withTooltip?: boolean;
};

export const PermissionGroupResourceLink = ({
  data,
  disabled,
  withTooltip,
}: Props) => {
  const link = `/workspace/permission-group/${data.id}`;

  return (
    <ResourceLink
      IconComponent={() => <PermissionGroupIcon className="h-4 w-4" />}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => <PermissionGroupResourceTooltip data={data} link={link} />
          : undefined
      }
      getDisplayName={(data) =>
        isPopulatedString(data.name) ? data.name : data.key!
      }
      link={link}
    />
  );
};
