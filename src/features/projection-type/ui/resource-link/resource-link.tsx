import { Shuffle } from "lucide-react";

import { ProjectionType } from "@/entities/projection";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";

import { ProjectionTypeResourceTooltip } from "./tooltip";

type Props = {
  data: ProjectionType;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function ProjectionTypeResourceLink({
  data,
  disabled,
  withTooltip,
}: Props) {
  const title = isPopulatedString(data.name) ? data.name : "N/A";
  const link = `/${PlatformArea.core}/projection-type/${data.id}`;

  return (
    <ResourceLink
      IconComponent={Shuffle}
      data={data}
      link={link}
      disabled={disabled}
      getDisplayName={() => title}
      renderTooltip={
        withTooltip
          ? (data) => <ProjectionTypeResourceTooltip data={data} link={link} />
          : undefined
      }
    />
  );
}
