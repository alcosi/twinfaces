import React from "react";

import { BaseSvgIcon, IconProps } from "@/shared/ui";

export function RectangleIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement> & IconProps) {
  return (
    <BaseSvgIcon className={className} viewBox="0 0 24 24" {...props}>
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 5H7C5.89543 5 5 5.89543 5 7V9M9 19H7C5.89543 19 5 18.1046 5 17V15M15 5H17C18.1046 5 19 5.89543 19 7V9M15 19H17C18.1046 19 19 18.1046 19 17V15"
      />
    </BaseSvgIcon>
  );
}
