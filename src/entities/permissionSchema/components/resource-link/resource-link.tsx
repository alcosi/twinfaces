import { isPopulatedString, isUndefined } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";
import { Scroll } from "lucide-react";
import { PermissionSchema } from "../../api";

type Props = {
  data: PermissionSchema;
  disabled?: boolean;
};

export const PermissionSchemaResourceLink = ({ data, disabled }: Props) => {
  if (isUndefined(data)) return null;

  const link = `/under-construction`;

  return (
    <ResourceLink
      IconComponent={() => <Scroll className="h-4 w-4" />}
      data={data}
      disabled={disabled}
      getDisplayName={(data) =>
        isPopulatedString(data.name) ? data.name : "N/A"
      }
      link={link}
    />
  );
};
