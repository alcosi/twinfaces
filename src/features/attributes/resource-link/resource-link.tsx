import { Hash } from "lucide-react";

import { FieldAttribute } from "@/entities/twinField";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";

import { TwinFieldAttributeResourceTooltip } from "./tooltip";

type Props = {
  data: FieldAttribute;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function TwinFieldAttributeResourceLink({
  data,
  disabled,
  withTooltip,
}: Props) {
  const link = `#`;

  return (
    <ResourceLink
      IconComponent={Hash}
      data={data}
      disabled={disabled}
      link={link}
      getDisplayName={(data): string =>
        isPopulatedString(data.id) ? data.id : "N/A"
      }
      renderTooltip={
        withTooltip
          ? (data) => (
              <TwinFieldAttributeResourceTooltip data={data} link={link} />
            )
          : undefined
      }
    />
  );
}
