import { PermissionSchema } from "@/entities/permission-schema";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";

import { PermissionSchemaIcon } from "../permission-schema-icon";
import { PermissionSchemaResourceTooltip } from "./tooltip";

type Props = {
  data: PermissionSchema;
  disabled?: boolean;
  withTooltip?: boolean;
};

export const PermissionSchemaResourceLink = ({
  data,
  disabled,
  withTooltip,
}: Props) => {
  const link = `/${PlatformArea.core}/permission-schemas/${data.id}`;

  return (
    <ResourceLink
      IconComponent={PermissionSchemaIcon}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => (
              <PermissionSchemaResourceTooltip data={data} link={link} />
            )
          : undefined
      }
      getDisplayName={(data) =>
        isPopulatedString(data.name) ? data.name : "N/A"
      }
      link={link}
    />
  );
};
