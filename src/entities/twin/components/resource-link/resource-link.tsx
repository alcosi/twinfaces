import { ResourceLink } from "@/shared/ui";
import { Braces } from "lucide-react";
import { TwinResourceTooltip } from "./tooltip";
import { Twin } from "../../api";

type Props = {
  data: Twin;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function TwinResourceLink({ data, disabled, withTooltip }: Props) {
  const link = `/twin/${data.id}`;

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
      getDisplayName={(data) => data.name ?? "N/A"}
      link={link}
    />
  );
}
