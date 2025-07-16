import React from "react";

import { BaseSvgIcon, IconProps } from "@/shared/ui";

export function ListULIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement> & IconProps) {
  return (
    <BaseSvgIcon className={className} viewBox="0 0 24 24" {...props}>
      <path
        strokeWidth="2"
        d="M8 6.00067L21 6.00139M8 12.0007L21 12.0015M8 18.0007L21 18.0015M3.5 6H3.51M3.5 12H3.51M3.5 18H3.51M4 6C4 6.27614 3.77614 6.5 3.5 6.5C3.22386 6.5 3 6.27614 3 6C3 5.72386 3.22386 5.5 3.5 5.5C3.77614 5.5 4 5.72386 4 6ZM4 12C4 12.2761 3.77614 12.5 3.5 12.5C3.22386 12.5 3 12.2761 3 12C3 11.7239 3.22386 11.5 3.5 11.5C3.77614 11.5 4 11.7239 4 12ZM4 18C4 18.2761 3.77614 18.5 3.5 18.5C3.22386 18.5 3 18.2761 3 18C3 17.7239 3.22386 17.5 3.5 17.5C3.77614 17.5 4 17.7239 4 18Z"
      />
    </BaseSvgIcon>
  );
}

export function ListOLIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement> & IconProps) {
  return (
    <BaseSvgIcon className={className} viewBox="0 0 24 24" {...props}>
      <path
        strokeWidth="2"
        d="M10 6L21 6.00066M10 12L21 12.0007M10 18L21 18.0007M3 5L5 4V10M5 10H3M5 10H7M7 20H3L6.41274 17.0139C6.78593 16.6873 7 16.2156 7 15.7197C7 14.7699 6.23008 14 5.28033 14H5C4.06808 14 3.28503 14.6374 3.06301 15.5"
      />
    </BaseSvgIcon>
  );
}
