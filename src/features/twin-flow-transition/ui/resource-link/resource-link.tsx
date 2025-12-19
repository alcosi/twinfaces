import { TwinFlowTransition_DETAILED } from "@/entities/twin-flow-transition";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";

import { TwinFlowTransitionIcon } from "../twin-flow-transition-icon";
import { TwinFlowTransitionResourceTooltip } from "./tooltip";

type Props = {
  data: TwinFlowTransition_DETAILED;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function TwinFlowTransitionResourceLink({
  data,
  disabled,
  withTooltip,
}: Props) {
  const link = `/${PlatformArea.core}/transitions/${data.id}`;

  return (
    <ResourceLink
      IconComponent={TwinFlowTransitionIcon}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => (
              <TwinFlowTransitionResourceTooltip data={data} link={link} />
            )
          : undefined
      }
      getDisplayName={(data) =>
        isPopulatedString(data.name) ? data.name : data.alias
      }
      link={link}
    />
  );
}
