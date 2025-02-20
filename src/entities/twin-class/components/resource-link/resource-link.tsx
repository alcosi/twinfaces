import { isPopulatedString } from "@/shared/libs";
import { Avatar, ResourceLink } from "@/shared/ui";
import { TwinClass_DETAILED } from "../../api";
import { TwinClassIcon } from "../twin-class-icon";
import { TwinClassResourceTooltip } from "./tooltip";

type Props = {
  data: TwinClass_DETAILED;
  disabled?: boolean;
  withTooltip?: boolean;
};

export const TwinClassResourceLink = ({
  data,
  disabled,
  withTooltip,
}: Props) => {
  const link = `/workspace/twinclass/${data.id}`;

  return (
    <ResourceLink
      IconComponent={
        data.logo ? () => <Avatar url={data.logo} size="sm" /> : TwinClassIcon
      }
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => <TwinClassResourceTooltip data={data} link={link} />
          : undefined
      }
      getDisplayName={(data) =>
        isPopulatedString(data.name) ? data.name : data.key
      }
      link={link}
    />
  );
};
