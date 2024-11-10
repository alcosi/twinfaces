import { TwinClassContext } from "@/app/twinclass/[twinClassId]/twin-class-context";
import { ResourceLink } from "@/shared/ui";
import { Link2 } from "lucide-react";
import { useContext } from "react";
import { TwinClassLinkResourceTooltip } from "./tooltip";
import { TwinClass } from "@/entities/twinClass";

type Props = {
  data: TwinClass;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function TwinClassLinkResourceLink({
  data,
  disabled,
  withTooltip,
}: Props) {
  const { twinClassId } = useContext(TwinClassContext);
  const link = `/twinclass/${twinClassId}/link/${data.id}`;

  return (
    <ResourceLink
      IconComponent={() => <Link2 className="h-4 w-4" />}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => <TwinClassLinkResourceTooltip data={data} link={link} />
          : undefined
      }
      getDisplayName={(data) => data.name ?? ""}
      link={link}
    />
  );
}
