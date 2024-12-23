import { ResourceLink } from "@/shared/ui";
import { Factory as FactoryIcon } from "lucide-react";
import { isPopulatedString } from "@/shared/libs";
import { FactoryResourceTooltip } from "@/entities/factory/components/resource-link/tooltip";
import { Factory } from "@/entities/factory";

type Props = {
  data: Factory;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function FactoryResourceLink({ data, disabled, withTooltip }: Props) {
  let title: string = "N/A";
  if (isPopulatedString(data.name)) title = data.name;
  else if (isPopulatedString(data.key)) title = data.key;

  const link = `/workspace/factories/${data.id}`;

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
