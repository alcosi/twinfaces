import { DataList } from "@/entities/datalist";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";

import { DatalistIcon } from "../datalist-icon";
import { DatalistResourceTooltip } from "./tooltip";

type Props = {
  data: DataList;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function DatalistResourceLink({ data, disabled, withTooltip }: Props) {
  const link = `/${PlatformArea.core}/datalists/${data.id}`;

  return (
    <ResourceLink
      IconComponent={DatalistIcon}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => <DatalistResourceTooltip data={data} link={link} />
          : undefined
      }
      getDisplayName={(data): string =>
        isPopulatedString(data.name) ? data.name : "N/A"
      }
      link={link}
    />
  );
}
