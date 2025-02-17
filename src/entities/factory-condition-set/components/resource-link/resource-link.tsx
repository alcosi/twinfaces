import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";
import { PencilRulerIcon } from "lucide-react";
import { FactoryConditionSetResourceTooltip } from "./tooltip";
import { FactoryConditionSet } from "../../api";

type Props = {
  data: FactoryConditionSet;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function FactoryConditionSetResourceLink({
  data,
  disabled,
  withTooltip,
}: Props) {
  const title = isPopulatedString(data.name) ? data.name : "N/A";
  const link = `/workspace/condition-sets/${data.id}`;

  return (
    <ResourceLink
      IconComponent={() => <PencilRulerIcon className="h-4 w-4" />}
      data={data}
      link={link}
      disabled={disabled}
      getDisplayName={() => title}
      renderTooltip={
        withTooltip
          ? (data) => (
              <FactoryConditionSetResourceTooltip data={data} link={link} />
            )
          : undefined
      }
    />
  );
}
