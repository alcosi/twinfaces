import { TwinClassContext } from "@/app/twinclass/[twinClassId]/twin-class-context";
import { isFullString } from "@/shared/libs";
import { Avatar, ResourceLink } from "@/shared/ui";
import { CircleDot } from "lucide-react";
import { useContext } from "react";
import { TwinClassStatus } from "../../api";
import { TwinClassStatusResourceTooltip } from "./tooltip";

type Props = {
  data: TwinClassStatus;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function TwinClassStatusResourceLink({
  data,
  disabled,
  withTooltip,
}: Props) {
  const { twinClassId } = useContext(TwinClassContext);

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
          ? (data) => <TwinClassStatusResourceTooltip data={data} />
          : undefined
      }
      getDisplayName={(data) => (isFullString(data.name) ? data.name : "N/A")}
      getLink={(data) => `/twinclass/${twinClassId}/twinStatus/${data.id}`}
    />
  );
}
