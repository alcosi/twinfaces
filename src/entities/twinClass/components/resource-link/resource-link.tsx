import { TwinClass } from "@/lib/api/api-types";
import { ResourceLink } from "@/shared/ui";
import { LayoutTemplate } from "lucide-react";
import { TwinClassResourceTooltip } from "./tooltip";

type Props = {
  data: TwinClass;
  disabled?: boolean;
  withTooltip?: boolean;
};

export const TwinClassResourceLink = ({
  data,
  disabled,
  withTooltip,
}: Props) => {
  return (
    <ResourceLink
      IconComponent={LayoutTemplate}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => <TwinClassResourceTooltip data={data} />
          : undefined
      }
      getDisplayName={(data) => data.id ?? ""}
      getLink={(data) => `/twinclass/${data.id}`}
    />
  );
};
