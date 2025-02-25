import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";
import { Square } from "lucide-react";
import { TwinStatus } from "../../api";
import { TwinStatusIcon } from "../twin-status-icon";
import { TwinClassStatusResourceTooltip } from "./tooltip";

type Props = {
  data: TwinStatus;
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
  const link = `/workspace/twinclass/${twinClassId}/twinStatus/${data.id}`;

  const Icon = data.backgroundColor ? (
    <Square
      className="w-4 h-4"
      fill={data.backgroundColor}
      stroke={data.backgroundColor}
    />
  ) : (
    <TwinStatusIcon className="w-4 h-4" />
  );

  return (
    <ResourceLink
      IconComponent={() => Icon}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => (
              <TwinClassStatusResourceTooltip
                data={data}
                link={link}
                IconComponent={TwinStatusIcon}
              />
            )
          : undefined
      }
      getDisplayName={(data) =>
        isPopulatedString(data.name) ? data.name : "N/A"
      }
      link={link}
    />
  );
}
