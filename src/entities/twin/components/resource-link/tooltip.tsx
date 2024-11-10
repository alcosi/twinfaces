import { TwinClassStatusResourceLink } from "@/entities/twinClassStatus";
import { UserResourceLink } from "@/entities/user";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLinkTooltip } from "@/shared/ui";
import { Braces } from "lucide-react";
import { Twin } from "../../api";

type Props = {
  data: Twin;
  link: string;
};

export function TwinResourceTooltip({ data, link }: Props) {
  return (
    <ResourceLinkTooltip uuid={data.id!} link={link}>
      <ResourceLinkTooltip.Header iconSource={Braces}>
        <div className="font-semibold text-lg">
          {isPopulatedString(data.name) ? data.name : "N/A"}
        </div>
      </ResourceLinkTooltip.Header>

      <ResourceLinkTooltip.Main>
        {data.description && <p>{data.description}</p>}
        {data.status && (
          <div className="flex gap-2">
            <strong>Status:</strong>
            <TwinClassStatusResourceLink
              data={data.status}
              twinClassId={data.twinClassId!}
            />
          </div>
        )}
        {data.authorUser && (
          <div className="flex gap-2">
            <strong>Author:</strong>
            <UserResourceLink data={data.authorUser} />
          </div>
        )}
        {data.assignerUser && (
          <div className="flex gap-2">
            <strong>Assigner:</strong>
            <UserResourceLink data={data.assignerUser} />
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
}
