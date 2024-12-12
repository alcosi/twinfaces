import { ResourceLink } from "@/shared/ui";
import { Braces } from "lucide-react";
import { TwinResourceTooltip } from "./tooltip";
import { Twin } from "../../api";
import { isPopulatedString } from "@/shared/libs";

type Props = {
  data: Twin;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function TwinResourceLink({ data, disabled, withTooltip }: Props) {
  const link = `/workspace/twin/${data.id}`;

  return (
    <ResourceLink
      IconComponent={Braces}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => <TwinResourceTooltip data={data} link={link} />
          : undefined
      }
      getDisplayName={(data) =>
        isPopulatedString(data.name) ? data.name : "N/A"
      }
      link={link}
    />
  );
}
