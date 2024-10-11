import { TwinClass } from "@/lib/api/api-types";
import { ResourceLink } from "@/shared/ui";
import { LayoutTemplate } from "lucide-react";
import { TwinClassResourceTooltip } from "./tooltip";

type Props = {
    data: TwinClass;
    withTooltip?: boolean;
}

export const TwinClassResourceLink = ({ data, withTooltip }: Props) => {
    return (
      <ResourceLink
        icon={<LayoutTemplate />}
        data={data}
        renderTooltip={(data) => withTooltip ? <TwinClassResourceTooltip data={data} /> : null}
        getDisplayName={(data) => data.id ?? ""}
        getLink={(data) => `/twinclass/${data.id}`}
      />
    );
}