import { DataList, DatalistIcon } from "@/entities/datalist";
import { DatalistResourceTooltip } from "@/entities/datalist/components/resource-link/tooltip";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";

type Props = {
  data: DataList;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function DatalistResourceLink({ data, disabled, withTooltip }: Props) {
  const link = `/workspace/datalists/${data.id}`;

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
