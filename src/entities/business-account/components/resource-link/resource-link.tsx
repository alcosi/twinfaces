import { BriefcaseBusinessIcon } from "lucide-react";

import { PlatformArea } from "@/shared/config";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";

import { BusinessAccount } from "../../api";
import { BusinessAccountResourceTooltip } from "./tooltip";

type Props = {
  data: BusinessAccount;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function BusinessAccountResourceLink({
  data,
  disabled,
  withTooltip,
}: Props) {
  const title = isPopulatedString(data.name) ? data.name : "N/A";
  const link = `/${PlatformArea.core}/business-account/${data.id}`;

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
