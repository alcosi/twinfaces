import React from "react";

import { BaseSvgIcon, IconProps } from "@/shared/ui";

export function HelpIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement> & IconProps) {
  return (
    <BaseSvgIcon
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      strokeWidth={0}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 18.5C14.6944 18.5 18.5 14.6944 18.5 10C18.5 5.30558 14.6944 1.5 10 1.5C5.30558 1.5 1.5 5.30558 1.5 10C1.5 14.6944 5.30558 18.5 10 18.5ZM10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20Z"
        fill="currentCollor"
      />
      <path
        d="M9 10C9 9.44772 9.44771 9 10 9C10.5523 9 11 9.44772 11 10V15C11 15.5523 10.5523 16 10 16C9.44771 16 9 15.5523 9 15V10Z"
        fill="currentCollor"
      />
      <path
        d="M11.25 5.94398C11.25 6.63434 10.6904 7.19398 10 7.19398C9.30964 7.19398 8.75 6.63434 8.75 5.94398C8.75 5.25363 9.30964 4.69398 10 4.69398C10.6904 4.69398 11.25 5.25363 11.25 5.94398Z"
        fill="currentCollor"
      />
    </BaseSvgIcon>
  );
}
