import { isPopulatedString, isUndefined } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";
import { Scroll } from "lucide-react";
import { PermissionSchema } from "../../api";
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
  if (isUndefined(data)) return null;

  const link = `/workspace/permission-schemas/${data.id}`;

  return (
    <ResourceLink
      IconComponent={() => <Scroll className="h-4 w-4" />}
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
