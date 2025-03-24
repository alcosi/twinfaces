import React from "react";

import { cn } from "@/shared/libs";
import { BaseSvgIcon, IconProps } from "@/shared/ui";

export function TwinFlowTransitionIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement> & IconProps) {
  return (
    <BaseSvgIcon className={cn(className)} viewBox="0 0 24 24" {...props}>
      <path
        d="M11.9999 11.9999H20.9999M20.9999 11.9999L17 8M20.9999 11.9999L17 15.9999M9 12H9.01M6 12H6.01M3 12H3.01"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </BaseSvgIcon>
  );
}
