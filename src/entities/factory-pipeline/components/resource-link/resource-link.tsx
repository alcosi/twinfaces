import { isPopulatedString } from "@/shared/libs";
import { FactoryPipeline } from "../../api";
import { ResourceLink } from "../../../../shared/ui";
import { FootprintsIcon } from "lucide-react";
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
  const title = isPopulatedString(data.id) ? data.id : "N/A";
  const link = `/workspace/factory-pipeline/${data.id}`;

  return (
    <ResourceLink
      IconComponent={() => <FootprintsIcon className="h-4 w-4" />}
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
