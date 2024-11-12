import { isPopulatedString } from "@/shared/libs";
import { Avatar, ResourceLinkTooltip } from "@/shared/ui";
import { Check, LayoutTemplate, X } from "lucide-react";
import { TwinClass_DETAILED } from "../../libs";
import { TwinClassResourceLink } from "./resource-link";

type Props = {
  data: TwinClass_DETAILED;
  link: string;
};

export const TwinClassResourceTooltip = ({ data, link }: Props) => {
  return (
    <ResourceLinkTooltip uuid={data.id} link={link}>
      <ResourceLinkTooltip.Header
        title={isPopulatedString(data.name) ? data.name : "N/A"}
        iconSource={
          data.logo ? (
            <Avatar url={data.logo} alt={data.name ?? "Logo"} size="xlg" />
          ) : (
            LayoutTemplate
          )
        }
      />

      <ResourceLinkTooltip.Main>
        {data.description && <p>{data.description}</p>}
        <ResourceLinkTooltip.Item title="Abstract">
          {data.abstractClass ? (
            <Check className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </ResourceLinkTooltip.Item>
        {/* // TODO: re-thinkg typing approach here (maybe use type guard) */}
        {data.extendsClass?.key && (
          <ResourceLinkTooltip.Item title="Extends">
            <TwinClassResourceLink
              data={data.extendsClass as TwinClass_DETAILED}
            />
          </ResourceLinkTooltip.Item>
        )}
        {/* // TODO: re-thinkg typing approach here (maybe use type guard) */}
        {data.headClass?.key && (
          <ResourceLinkTooltip.Item title="Head">
            <TwinClassResourceLink
              data={data.headClass as TwinClass_DETAILED}
            />
          </ResourceLinkTooltip.Item>
        )}
        {data.createdAt && (
          <ResourceLinkTooltip.Item title="Created at">
            {new Date(data.createdAt).toLocaleDateString()}
          </ResourceLinkTooltip.Item>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
};
