import React from "react";

import { BaseSvgIcon, IconProps } from "@/shared/ui";

export function FiltersIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement> & IconProps) {
  return (
    <BaseSvgIcon
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={0}
      {...props}
    >
      <path
        d="M9 12C10.772 12 12.273 10.8465 12.798 9.25H22.25V6.75H12.798C12.273 5.1535 10.772 4 9 4C7.228 4 5.727 5.1535 5.202 6.75H1.75V9.25H5.202C5.727 10.8465 7.228 12 9 12ZM9 6.5C9.827 6.5 10.5 7.173 10.5 8C10.5 8.827 9.827 9.5 9 9.5C8.173 9.5 7.5 8.827 7.5 8C7.5 7.173 8.173 6.5 9 6.5Z"
        fill="#334CEB"
      />
      <path
        d="M15 20C16.772 20 18.273 18.8465 18.798 17.25H22.25V14.75H18.798C18.273 13.1535 16.772 12 15 12C13.228 12 11.727 13.1535 11.202 14.75H1.75V17.25H11.202C11.727 18.8465 13.228 20 15 20ZM15 14.5C15.827 14.5 16.5 15.173 16.5 16C16.5 16.827 15.827 17.5 15 17.5C14.173 17.5 13.5 16.827 13.5 16C13.5 15.173 14.173 14.5 15 14.5Z"
        fill="#334CEB"
      />
    </BaseSvgIcon>
  );
}
