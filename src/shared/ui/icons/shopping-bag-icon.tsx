import React from "react";

import { BaseSvgIcon, IconProps } from "@/shared/ui";

export function ShopingBagIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement> & IconProps) {
  return (
    <BaseSvgIcon className={className} viewBox="0 0 24 24" {...props}>
      <g>
        <path
          fill="none"
          d="M4.50938 10.4343C4.7433 8.79689 4.86026 7.97818 5.42419 7.48909C5.98812 7 6.81514 7 8.46918 7H9H15H15.5308C17.1849 7 18.0119 7 18.5758 7.48909C19.1397 7.97818 19.2567 8.79689 19.4906 10.4343L20.3478 16.4343C20.6512 18.5586 20.803 19.6208 20.2049 20.3104C19.6068 21 18.5339 21 16.388 21H16H8H7.61204C5.46614 21 4.3932 21 3.79511 20.3104C3.19703 19.6208 3.34877 18.5586 3.65224 16.4343L4.50938 10.4343Z"
        />
        <path
          fill="none"
          d="M9 11V5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V11"
        ></path>
      </g>
    </BaseSvgIcon>
  );
}
