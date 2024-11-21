import { ResourceLink } from "@/shared/ui";
import { ArrowRightLeft } from "lucide-react";
import { TwinFlowTransition } from "../../api";
import { TwinClassTransitionResourceTooltip } from "./tooltip";

type Props = {
  data: TwinFlowTransition;
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
  const link = `/twinclass/${twinClassId}/twinflow/${twinFlowId}/transition/${data.id}`;

  return (
    <ResourceLink
      IconComponent={() => <ArrowRightLeft className="h-4 w-4" />}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => (
              <TwinClassTransitionResourceTooltip data={data} link={link} />
            )
          : undefined
      }
      getDisplayName={(data) => data.name ?? ""}
      link={link}
    />
  );
}
