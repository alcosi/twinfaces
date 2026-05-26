import { BriefcaseBusinessIcon } from "lucide-react";

import { BusinessAccount } from "@/entities/business-account";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";

import { BusinessAccountResourceTooltip } from "./tooltip";

type Props = {
  data: BusinessAccount;
  disabled?: boolean;
  withTooltip?: boolean;
  route?: string;
  domainBusinessAccountId?: string;
};

export function BusinessAccountResourceLink({
  data,
  disabled,
  withTooltip,
  route = "business-accounts",
  domainBusinessAccountId,
}: Props) {
  const title = isPopulatedString(data.name) ? data.name : "N/A";
  const link = `/${PlatformArea.core}/${route}/${domainBusinessAccountId ?? data.id}`;

  return (
    <ResourceLink
      IconComponent={() => <BriefcaseBusinessIcon className="h-4 w-4" />}
      data={data}
      link={link}
      disabled={disabled}
      getDisplayName={() => title}
      renderTooltip={
        withTooltip
          ? (data) => <BusinessAccountResourceTooltip data={data} link={link} />
          : undefined
      }
    />
  );
}
