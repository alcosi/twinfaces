import { Megaphone } from "lucide-react";

import { Recipient } from "@/entities/notification";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";

import { RecipientResourceTooltip } from "./tooltip";

type Props = {
  data: Recipient;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function RecipientResourceLink({ data, disabled, withTooltip }: Props) {
  const link = `/${PlatformArea.core}/recipient/${data.id}`;

  return (
    <ResourceLink
      IconComponent={Megaphone}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => <RecipientResourceTooltip data={data} link={link} />
          : undefined
      }
      getDisplayName={(data) =>
        isPopulatedString(data.name) ? data.name : data.id!
      }
      link={link}
    />
  );
}
