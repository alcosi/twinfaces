import { BellRing } from "lucide-react";

import { NotificationSchema } from "@/entities/notification";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";

import { NotificationSchemaResourceTooltip } from "./tooltip";

type Props = {
  data: NotificationSchema;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function NotificationSchemaResourceLink({
  data,
  disabled,
  withTooltip,
}: Props) {
  const link = `/${PlatformArea.core}/notification-schema/${data.id}`;

  return (
    <ResourceLink
      IconComponent={BellRing}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => (
              <NotificationSchemaResourceTooltip data={data} link={link} />
            )
          : undefined
      }
      getDisplayName={(data) =>
        isPopulatedString(data.name) ? data.name : data.id!
      }
      link={link}
    />
  );
}
