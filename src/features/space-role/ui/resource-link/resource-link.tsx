import { VenetianMask } from "lucide-react";

import { SpaceRole } from "@/entities/spaceRole";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";

import { SpaceRoleResourceTooltip } from "./tooltip";

type Props = {
  data: SpaceRole;
  disabled?: boolean;
  withTooltip?: boolean;
};

export const SpaceRoleResourceLink = ({
  data,
  disabled,
  withTooltip,
}: Props) => {
  const link = `/${PlatformArea.core}/space-roles/${data.id}`;

  return (
    <ResourceLink
      IconComponent={() => <VenetianMask className="h-4 w-4" />}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => <SpaceRoleResourceTooltip data={data} link={link} />
          : undefined
      }
      getDisplayName={(data) =>
        isPopulatedString(data?.name) ? data.name : data.key!
      }
      link={link}
    />
  );
};
