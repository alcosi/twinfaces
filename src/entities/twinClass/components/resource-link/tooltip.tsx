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
        iconSource={
          data.logo ? (
            <Avatar url={data.logo} alt={data.name ?? "Logo"} size="xlg" />
          ) : (
            LayoutTemplate
          )
        }
      >
        <div className="font-semibold text-lg">
          {isPopulatedString(data.name) ? data.name : "N/A"}
        </div>
      </ResourceLinkTooltip.Header>

      <ResourceLinkTooltip.Main>
        {data.description && <p>{data.description}</p>}
        <div className="flex flex-row gap-2 items-center font-semibold">
          <strong>Abstract: </strong>
          {data.abstractClass ? (
            <Check className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </div>
        {/* // TODO: re-thinkg typing approach here (maybe use type guard) */}
        {data.extendsClass?.key && (
          <div className="flex gap-2">
            <strong>Extends:</strong>
            <TwinClassResourceLink
              data={data.extendsClass as TwinClass_DETAILED}
            />
          </div>
        )}
        {/* // TODO: re-thinkg typing approach here (maybe use type guard) */}
        {data.headClass?.key && (
          <div className="flex gap-2">
            <strong>Head:</strong>
            <TwinClassResourceLink
              data={data.headClass as TwinClass_DETAILED}
            />
          </div>
        )}
        {data.createdAt && (
          <div className="flex flex-row gap-2 items-center">
            <strong>Created at:</strong>
            {new Date(data.createdAt).toLocaleDateString()}
          </div>
        )}
      </ResourceLinkTooltip.Main>
    </ResourceLinkTooltip>
  );
};

{
  /* <Component
        iconSource={
          props.logo ? (
            <Braces />
          ) : (
            LayoutTemplate
          )
        }
      /> */
}
