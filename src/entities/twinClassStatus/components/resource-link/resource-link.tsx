import { isPopulatedString } from "@/shared/libs";
import { Avatar, ResourceLink } from "@/shared/ui";
import { CircleDot } from "lucide-react";
import { TwinClassStatus } from "../../api";
import { TwinClassStatusResourceTooltip } from "./tooltip";

type Props = {
  data: TwinClassStatus;
  twinClassId: string;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function TwinClassStatusResourceLink({
  data,
  twinClassId,
  disabled,
  withTooltip,
}: Props) {
  const link = `/twinclass/${twinClassId}/twinStatus/${data.id}`;

  return (
    <ResourceLink
      IconComponent={() =>
        data.logo ? (
          <Avatar url={data.logo} size="sm" />
        ) : (
          <CircleDot className="h-4 w-4" />
        )
      }
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => <TwinClassStatusResourceTooltip data={data} link={link} />
          : undefined
      }
      getDisplayName={(data) =>
        isPopulatedString(data.name) ? data.name : "N/A"
      }
      link={link}
    />
  );
}
