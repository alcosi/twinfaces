import { TwinClass } from "@/entities/twin-class";
import { ResourceLink } from "@/shared/ui";
import { Link2 } from "lucide-react";
import { LinkResourceTooltip } from "./tooltip";

type Props = {
  data: TwinClass;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function LinkResourceLink({ data, disabled, withTooltip }: Props) {
  const link = `/workspace/links/${data.id}`;

  return (
    <ResourceLink
      IconComponent={() => <Link2 className="h-4 w-4" />}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => <LinkResourceTooltip data={data} link={link} />
          : undefined
      }
      getDisplayName={(data) => data.name ?? ""}
      link={link}
    />
  );
}
