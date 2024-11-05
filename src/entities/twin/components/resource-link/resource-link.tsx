import { ResourceLink } from "@/shared/ui";
import { Braces } from "lucide-react";
import { TwinResourceTooltip } from "./tooltip";
import { TwinBase } from "../../api";

type Props = {
  data: TwinBase;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function TwinResourceLink({ data, disabled, withTooltip }: Props) {
  return (
    <ResourceLink
      IconComponent={Braces}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip ? (data) => <TwinResourceTooltip data={data} /> : undefined
      }
      getDisplayName={(data) => data.name ?? "N/A"}
      getLink={(data) => `/twin/${data.id}`}
    />
  );
}
