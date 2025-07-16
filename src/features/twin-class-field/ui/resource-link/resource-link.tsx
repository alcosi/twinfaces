import { TwinClassField_DETAILED } from "@/entities/twin-class-field";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";

import { FieldIcon } from "../field-icon";
import { TwinClassFieldResourceTooltip } from "./tooltip";

type Props = {
  data: TwinClassField_DETAILED;
  disabled?: boolean;
  withTooltip?: boolean;
};

export const TwinClassFieldResourceLink = ({
  data,
  disabled,
  withTooltip,
}: Props) => {
  const link = `/${PlatformArea.core}/fields/${data.id}`;

  return (
    <ResourceLink
      IconComponent={FieldIcon}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => <TwinClassFieldResourceTooltip data={data} link={link} />
          : undefined
      }
      getDisplayName={(data) =>
        isPopulatedString(data.name) ? data.name : data.key
      }
      link={link}
    />
  );
};
