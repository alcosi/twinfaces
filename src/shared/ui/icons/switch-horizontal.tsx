import React from "react";

import { BaseSvgIcon, IconProps } from "@/shared/ui";

export function SwitchHorizontalIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement> & IconProps) {
  return (
    <>
      <BaseSvgIcon className={className} viewBox="0 0 24 24" {...props}>
        <path
          d="M20 17H4M4 17L8 13M4 17L8 21M4 7H20M20 7L16 3M20 7L16 11"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </BaseSvgIcon>
      {/* <BaseSvgIcon className={className} viewBox="0 0 24 24" {...props}>
        <path
          d="M21 9L9 9"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 15L3 15"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18 12L20.913 9.08704V9.08704C20.961 9.03897 20.961 8.96103 20.913 8.91296V8.91296L18 6"
          stroke="#ff0000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 18L3.08704 15.087V15.087C3.03897 15.039 3.03897 14.961 3.08704 14.913V14.913L6 12"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </BaseSvgIcon> */}
    </>
  );
}
