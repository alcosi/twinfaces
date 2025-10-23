import { Option } from "lucide-react";

import { DataListOptionV1 } from "@/entities/datalist-option";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";

import { DatalistResourceLink } from "../../../datalist/ui";

type Props = {
  data: DataListOptionV1;
  link: string;
};

export function DatalistOptionResourceTooltip({ data, link }: Props) {
  return (
    <ResourceLinkTooltip uuid={data.id!} link={link}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        iconSource={<Option size={35} />}
      />

      <ResourceLinkTooltip.Main>
        {data.dataListId && (
          <ResourceLinkTooltip.Item title="Datalist">
            <DatalistResourceLink data={data} />
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
}
