import { DataListV1 } from "@/entities/twinClass";
import { ResourceLink } from "@/shared/ui";
import { ListTree } from "lucide-react";
import { isPopulatedString } from "@/shared/libs";
import { DatalistResourceTooltip } from "@/entities/datalist/components/resource-link/tooltip";

type PropsDataLink = {
  data: DataListV1;
  disabled?: boolean;
  withTooltip?: boolean;
};

export const DatalistResourceLink = ({
  data,
  disabled,
  withTooltip,
}: PropsDataLink) => {
  const link = `/datalists/${data.id}`;

  return (
    <ResourceLink
      IconComponent={() => (data ? <ListTree size={20} /> : "N/A")}
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
};
