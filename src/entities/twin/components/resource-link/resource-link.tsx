import { ResourceLink } from "@/shared/ui";
import { Braces } from "lucide-react";
import { Twin } from "../../api";
import { formatTwinDisplay } from "../../libs";
import { TwinResourceTooltip } from "./tooltip";

type Props = {
  data: Twin;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function TwinResourceLink({ data, disabled, withTooltip }: Props) {
  const link = `/workspace/twins/${data.id}`;

  return (
    <ResourceLink
      IconComponent={Braces}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => <TwinResourceTooltip data={data} link={link} />
          : undefined
      }
      getDisplayName={formatTwinDisplay}
      link={link}
    />
  );
}
