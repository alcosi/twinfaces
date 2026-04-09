import { Wand } from "lucide-react";

import { TwinTrigger } from "@/entities/twin-trigger/index";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";

import { TwinTriggerResourceTooltip } from "./tooltip";

type Props = {
  data: TwinTrigger;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function TwinTriggerResourceLink({
  data,
  disabled,
  withTooltip,
}: Props) {
  const link = `/${PlatformArea.core}/twin-triggers/${data.id}`;

  return (
    <ResourceLink
      IconComponent={Wand}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => <TwinTriggerResourceTooltip data={data} link={link} />
          : undefined
      }
      getDisplayName={(data) =>
        isPopulatedString(data.name) ? data.name : data.id!
      }
      link={link}
    />
  );
}
