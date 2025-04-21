import { Play } from "lucide-react";

import { Featurer_DETAILED } from "@/entities/featurer";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";

import { FeaturerResourceTooltip } from "./tooltip";

type Props = {
  data: Featurer_DETAILED;
  disabled?: boolean;
  withTooltip?: boolean;
};

export const FeaturerResourceLink = ({
  data,
  disabled,
  withTooltip,
}: Props) => {
  const link = `/${PlatformArea.core}/featurer/${data.id}`;

  return (
    <ResourceLink
      IconComponent={Play}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => <FeaturerResourceTooltip data={data} link={link} />
          : undefined
      }
      getDisplayName={(data) =>
        isPopulatedString(data.name) ? data.name : "N/A"
      }
      link={link}
    />
  );
};
