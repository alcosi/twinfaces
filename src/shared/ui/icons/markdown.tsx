import React from "react";

import { BaseSvgIcon, IconProps } from "@/shared/ui";

export function MarkdownIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement> & IconProps) {
  return (
    <BaseSvgIcon className={className} viewBox="0 0 32 32" {...props}>
      <path d="M 2.875 6 C 1.320313 6 0 7.253906 0 8.8125 L 0 23.1875 C 0 24.746094 1.320313 26 2.875 26 L 29.125 26 C 30.679688 26 32 24.746094 32 23.1875 L 32 8.8125 C 32 7.253906 30.679688 6 29.125 6 Z M 2.875 8 L 29.125 8 C 29.640625 8 30 8.382813 30 8.8125 L 30 23.1875 C 30 23.617188 29.640625 24 29.125 24 L 2.875 24 C 2.359375 24 2 23.617188 2 23.1875 L 2 8.8125 C 2 8.382813 2.359375 8 2.875 8 Z M 5 11 L 5 21 L 8 21 L 8 14.34375 L 11 18.3125 L 14 14.34375 L 14 21 L 17 21 L 17 11 L 14 11 L 11 15 L 8 11 Z M 22 11 L 22 16 L 19 16 L 23.5 21 L 28 16 L 25 16 L 25 11 Z" />
    </BaseSvgIcon>
  );
}
