import { TicketCheck } from "lucide-react";

import { ValidatorSet_DETAILED } from "@/entities/validator-set";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";

import { ValidatorSetResourceTooltip } from "./tooltip";

type Props = {
  data: ValidatorSet_DETAILED;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function ValidatorSetResourceLink({
  data,
  disabled,
  withTooltip,
}: Props) {
  const link = `/${PlatformArea.core}/validator-sets/${data.id}`;

  return (
    <ResourceLink
      IconComponent={TicketCheck}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => <ValidatorSetResourceTooltip data={data} link={link} />
          : undefined
      }
      getDisplayName={(data) =>
        isPopulatedString(data.name) ? data.name : data.id
      }
      link={link}
    />
  );
}
