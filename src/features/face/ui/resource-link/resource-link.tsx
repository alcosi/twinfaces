import { FaceNB001 } from "@/entities/face";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString } from "@/shared/libs";
import { ResourceLink } from "@/shared/ui";

import { FaceNavBarIcon } from "../face-nav-bar-icon";
import { FaceNavBarResourceTooltip } from "./tooltip";

type Props = {
  data: FaceNB001;
  disabled?: boolean;
  withTooltip?: boolean;
};

export function FaceNavBarResourceLink({ data, disabled, withTooltip }: Props) {
  const link = `/${PlatformArea.core}/faces/nb001/${data.id}`;

  return (
    <ResourceLink
      IconComponent={FaceNavBarIcon}
      data={data}
      disabled={disabled}
      renderTooltip={
        withTooltip
          ? (data) => <FaceNavBarResourceTooltip data={data} link={link} />
          : undefined
      }
      getDisplayName={(data): string =>
        isPopulatedString(data.name) ? data.name : "N/A"
      }
      link={link}
    />
  );
}
