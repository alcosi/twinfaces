import { Option } from "lucide-react";

import { DataListOptionV3 } from "@/entities/datalist-option";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";

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
  const link = `/${PlatformArea.core}/datalist-options/${data.id}`;

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
