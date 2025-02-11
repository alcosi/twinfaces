import { isPopulatedString, isUndefined } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";
import { VenetianMask } from "lucide-react";
import { SpaceRole } from "../../api";
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
  if (isUndefined(data)) return null;

  const link = `/workspace/space-role/${data.id}`;

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
