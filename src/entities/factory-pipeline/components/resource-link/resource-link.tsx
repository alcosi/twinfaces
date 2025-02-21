import { isPopulatedString, shortenUUID } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";
import { FactoryPipeline } from "../../api";
import { FactoryPipelineIcon } from "../factory-pipeline-icon";
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
      IconComponent={FactoryPipelineIcon}
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
