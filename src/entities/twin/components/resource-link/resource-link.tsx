import { ResourceLink } from "@/shared/ui";
import { Twin } from "../../api";
import { formatTwinDisplay } from "../../libs";
import { TwinIcon } from "../twin-icon";
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
      IconComponent={TwinIcon}
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
