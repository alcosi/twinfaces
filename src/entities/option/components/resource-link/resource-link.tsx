import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";
import { Option } from "lucide-react";
import {
  DatalistOptionResourceTooltip,
  DataListOptionV3,
} from "@/entities/option";

type PropsDataLink = {
  data: DataListOptionV3;
  disabled?: boolean;
  withTooltip?: boolean;
};

export const DatalistOptionResourceLink = ({
  data,
  disabled,
  withTooltip,
}: PropsDataLink) => {
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
};
