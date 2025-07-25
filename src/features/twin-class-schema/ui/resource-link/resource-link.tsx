import { TwinClassSchema_DETAILED } from "@/entities/twin-class-schema";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";

import { TwinClassSchemaIcon } from "../twin-class-schema-icon";
import { TwinClassSchemaResourceTooltip } from "./tooltip";

type Props = {
  data: TwinClassSchema_DETAILED;
  disabled?: boolean;
  withTooltip?: boolean;
};

export const TwinClassSchemaResourceLink = ({
  data,
  disabled,
  withTooltip,
}: Props) => {
  const link = `/under-construction`;

  return (
    <ResourceLink
      IconComponent={TwinClassSchemaIcon}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => <TwinClassSchemaResourceTooltip data={data} link={link} />
          : undefined
      }
      getDisplayName={(data) =>
        isPopulatedString(data?.name) ? data.name : "N/A"
      }
      link={link}
    />
  );
};
