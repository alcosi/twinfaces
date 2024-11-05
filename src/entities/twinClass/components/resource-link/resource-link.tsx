import { isPopulatedString } from "@/shared/libs";
import { Avatar, ResourceLink } from "@/shared/ui";
import { LayoutTemplate } from "lucide-react";
import { TwinClass_DETAILED } from "../../libs";
import { TwinClassResourceTooltip } from "./tooltip";

type Props = {
  data: TwinClass_DETAILED;
  disabled?: boolean;
  withTooltip?: boolean;
};

export const TwinClassResourceLink = ({
  data,
  disabled,
  withTooltip,
}: Props) => {
  return (
    <ResourceLink
      IconComponent={
        data.logo ? () => <Avatar url={data.logo} size="sm" /> : LayoutTemplate
      }
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => <TwinClassResourceTooltip data={data} />
          : undefined
      }
      getDisplayName={(data) =>
        isPopulatedString(data.name) ? data.name : data.key
      }
      getLink={(data) => `/twinclass/${data.id}`}
    />
  );
};
