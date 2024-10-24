import { TwinClassContext } from "@/app/twinclass/[twinClassId]/twin-class-context";
import { TwinClassLink } from "@/lib/api/api-types";
import { ResourceLink } from "@/shared/ui";
import { Link2 } from "lucide-react";
import { useContext } from "react";
import { TwinClassLinkResourceTooltip } from "./tooltip";

type Props = {
  data: TwinClassLink;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function TwinClassLinkResourceLink({
  data,
  disabled,
  withTooltip,
}: Props) {
  const { twinClassId } = useContext(TwinClassContext);

  return (
    <ResourceLink
      IconComponent={Link2}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => (
              <TwinClassLinkResourceTooltip
                data={data}
                twinClassId={twinClassId}
              />
            )
          : undefined
      }
      getDisplayName={(data) => data.id ?? ""}
      getLink={(data) => `/twinclass/${twinClassId}/link/${data.id}`}
    />
  );
}
