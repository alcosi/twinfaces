import { SquareActivity } from "lucide-react";

import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";

import { TwinFlowSchema_DETAILED } from "../../api";
import { TwinFlowSchemaResourceTooltip } from "./tooltip";

type Props = {
  data: TwinFlowSchema_DETAILED;
  disabled?: boolean;
  withTooltip?: boolean;
};

export const TwinFlowSchemaResourceLink = ({
  data,
  disabled,
  withTooltip,
}: Props) => {
  const link = `/workspace/twinFlowSchema/${data.id}`;

  return (
    <ResourceLink
      IconComponent={SquareActivity}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => <TwinFlowSchemaResourceTooltip data={data} link={link} />
          : undefined
      }
      getDisplayName={(data) =>
        isPopulatedString(data.name) ? data.name : data.id
      }
      link={link}
    />
  );
};
