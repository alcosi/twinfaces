import { ArrowRightLeft } from "lucide-react";

import { PlatformArea } from "@/shared/config";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";

import { TwinFlowTransition_DETAILED } from "../../api";
import { TwinFlowTransitionIcon } from "../twin-flow-transition-icon";
import { TwinFlowTransitionResourceTooltip } from "./tooltip";

type Props = {
  data: TwinFlowTransition_DETAILED;
  twinClassId: string;
  twinFlowId: string;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function TwinFlowTransitionResourceLink({
  data,
  twinClassId,
  twinFlowId,
  disabled,
  withTooltip,
}: Props) {
  const link = `/${PlatformArea.core}/twinclass/${twinClassId}/twinflow/${twinFlowId}/transition/${data.id}`;

  return (
    <ResourceLink
      // IconComponent={() => <ArrowRightLeft className="h-4 w-4" />}
      IconComponent={TwinFlowTransitionIcon}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => (
              <TwinFlowTransitionResourceTooltip
                data={data}
                link={link}
                twinClassId={twinClassId}
              />
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
