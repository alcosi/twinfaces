import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";
import { TwinFlow_DETAILED } from "../../api";
import { TwinFlowIcon } from "../twin-flow-icon";
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
  const link = `/workspace/twinFlow/${data.id}`;

  return (
    <ResourceLink
      IconComponent={TwinFlowIcon}
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
