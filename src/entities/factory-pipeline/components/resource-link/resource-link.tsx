import { isPopulatedString, shortenUUID } from "@/shared/libs";
import { FactoryPipeline } from "../../api";
import { ResourceLink } from "@/shared/ui";
import { FenceIcon } from "lucide-react";
import { FactoryPipelineResourceTooltip } from "./tooltip";

type Props = {
  data: FactoryPipeline;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function FactoryPipelineResourceLink({
  data,
  disabled,
  withTooltip,
}: Props) {
  const title = isPopulatedString(data.id) ? shortenUUID(data.id) : "N/A";
  const link = `/workspace/factory-pipeline/${data.id}`;

  return (
    <ResourceLink
      IconComponent={() => <FenceIcon className="h-4 w-4" />}
      data={data}
      link={link}
      disabled={disabled}
      getDisplayName={() => title}
      renderTooltip={
        withTooltip
          ? (data) => <FactoryPipelineResourceTooltip data={data} link={link} />
          : undefined
      }
    />
  );
}
