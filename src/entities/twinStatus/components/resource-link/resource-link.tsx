import { cn, isPopulatedString } from "@/shared/libs";
import { Avatar, ResourceLink } from "@/shared/ui";
import { css } from "@emotion/css";
import { Square } from "lucide-react";
import { useTheme } from "next-themes";
import { TwinStatus } from "../../api";
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
  const { theme } = useTheme();
  const link = `/twinclass/${twinClassId}/twinStatus/${data.id}`;
  const squareColor =
    data.backgroundColor || (theme === "light" ? "#0c66e4" : "#579dff");

  return (
    <ResourceLink
      IconComponent={() =>
        data.logo ? (
          <Avatar url={data.logo} alt={data.key} size="sm" />
        ) : (
          <Square className="w-4 h-4" fill={squareColor} stroke={squareColor} />
        )
      }
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => (
              <TwinClassStatusResourceTooltip
                data={data}
                link={link}
                IconComponent={() =>
                  data.logo ? (
                    <Avatar url={data.logo} alt={data.key} size="xlg" />
                  ) : (
                    <div
                      className={cn(
                        "w-16 h-16 rounded-full",
                        css`
                          background-color: ${squareColor};
                        `
                      )}
                    />
                  )
                }
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
