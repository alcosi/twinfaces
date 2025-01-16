import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";
import { Option } from "lucide-react";
import { DataListOptionV3 } from "@/entities/option";
import { DatalistOptionResourceTooltip } from "./tooltip";

type Props = {
  data: DataListOptionV3;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function DatalistOptionResourceLink({
  data,
  disabled,
  withTooltip,
}: Props) {
  const link = `/workspace/datalists/${data.dataListId}/options/${data.id}`;

  return (
    <ResourceLink
      IconComponent={Option}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => <DatalistOptionResourceTooltip data={data} link={link} />
          : undefined
      }
      getDisplayName={(data): string =>
        isPopulatedString(data.name) ? data.name : "N/A"
      }
      link={link}
    />
  );
}
