import { DataList } from "@/entities/datalist";
import { DatalistResourceTooltip } from "@/entities/datalist/components/resource-link/tooltip";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";
import { ListTree } from "lucide-react";

type Props = {
  data: DataList;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function DatalistResourceLink({ data, disabled, withTooltip }: Props) {
  const link = `/workspace/datalists/${data.id}`;

  return (
    <ResourceLink
      IconComponent={ListTree}
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
