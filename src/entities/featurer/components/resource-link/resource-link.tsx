import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";
import { Play } from "lucide-react";
import { Featurer_DETAILED } from "../../api";
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
  const link = `/workspace/featurer/${data.id}`;

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
