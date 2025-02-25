import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";
import { Square } from "lucide-react";
import { useTheme } from "next-themes";
import { TwinStatus } from "../../api";
import { TwinClassStatusResourceTooltip } from "./tooltip";
import { TwinStatusIcon } from "../twin-status-icon";

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
  const { theme } = useTheme();
  const link = `/workspace/twinclass/${twinClassId}/twinStatus/${data.id}`;
  const squareColor =
    data.backgroundColor || (theme === "light" ? "#0c66e4" : "#579dff");

  return (
    <ResourceLink
      IconComponent={() => (
        <Square className="w-4 h-4" fill={squareColor} stroke={squareColor} />
      )}
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
