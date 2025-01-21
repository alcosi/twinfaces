import { components } from "@/shared/api/generated/schema";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";
import { FactoryIcon } from "lucide-react";
import { FactoryConditionSetResourceTooltip } from "./tooltip";

export type FactoryConditionSet =
  components["schemas"]["FactoryConditionSetV1"];

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
  let title: string = "N/A";
  const link = `/workspace/factories/${data.id}`;

  if (isPopulatedString(data.name)) title = data.name;

  return (
    <ResourceLink
      IconComponent={() => <FactoryIcon className="h-4 w-4" />}
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
