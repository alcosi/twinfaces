import { Factory as FactoryIcon } from "lucide-react";

import { Factory } from "@/entities/factory";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";

import { FactoryResourceTooltip } from "./tooltip";

type Props = {
  data: Factory;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function FactoryResourceLink({ data, disabled, withTooltip }: Props) {
  let title: string = "N/A";
  if (isPopulatedString(data.name)) title = data.name;
  else if (isPopulatedString(data.key)) title = data.key;

  const link = `/${PlatformArea.core}/factories/${data.id}`;

  return (
    <ResourceLink
      IconComponent={() => <FactoryIcon className="h-4 w-4" />}
      data={data}
      link={link}
      disabled={disabled}
      getDisplayName={() => title}
      renderTooltip={
        withTooltip
          ? (data) => <FactoryResourceTooltip data={data} link={link} />
          : undefined
      }
    />
  );
}
