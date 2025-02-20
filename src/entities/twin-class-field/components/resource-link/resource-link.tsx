import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";
import { TwinClassField_DETAILED } from "../../api";
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
  const link = `/workspace/twinClassField/${data.id}`;

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
