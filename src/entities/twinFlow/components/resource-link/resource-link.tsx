import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";
import { Activity } from "lucide-react";
import { TwinFlow_DETAILED } from "../../api";
import { TwinFlowResourceTooltip } from "./tooltip";

type Props = {
  data: TwinFlow_DETAILED;
  disabled?: boolean;
  withTooltip?: boolean;
};

export const TwinFlowResourceLink = ({
  data,
  disabled,
  withTooltip,
}: Props) => {
  const link = `/twinFlow/${data.id}`;

  return (
    <ResourceLink
      IconComponent={Activity}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => <TwinFlowResourceTooltip data={data} link={link} />
          : undefined
      }
      getDisplayName={(data) =>
        isPopulatedString(data.name) ? data.name : "N/A"
      }
      link={link}
    />
  );
};
