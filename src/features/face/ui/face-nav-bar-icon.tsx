import React from "react";

import { BaseSvgIcon, IconProps } from "@/shared/ui";

export function FaceNavBarIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement> & IconProps) {
  return (
    <BaseSvgIcon className={className} viewBox="0 0 64 64" {...props}>
      <path
        id="sidebar"
        d="M50.008,56l-35.989,0c-3.309,0 -5.995,-2.686 -5.995,-5.995l0,-36.011c0,-3.308 2.686,-5.995 5.995,-5.995l35.989,0c3.309,0 5.995,2.687 5.995,5.995l0,36.011c0,3.309 -2.686,5.995 -5.995,5.995Zm-25.984,-4.001l0,-39.999l-9.012,0c-1.65,0 -2.989,1.339 -2.989,2.989l0,34.021c0,1.65 1.339,2.989 2.989,2.989l9.012,0Zm24.991,-39.999l-20.991,0l0,39.999l20.991,0c1.65,0 2.989,-1.339 2.989,-2.989l0,-34.021c0,-1.65 -1.339,-2.989 -2.989,-2.989Z"
      />
      <path
        id="code"
        d="M16.024,38.774l6.828,-6.828l-6.828,-6.829l-2.829,2.829l4,4l-4,4l2.829,2.828Z"
      />
    </BaseSvgIcon>
  );
}
