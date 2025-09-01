import React from "react";

import { BaseSvgIcon, IconProps } from "@/shared/ui";

export function DotsIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement> & IconProps) {
  return (
    <BaseSvgIcon
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      // strokeWidth={0}
      {...props}
    >
      <path
        d="M10.0002 3.33333C10.9206 3.33333 11.6668 2.58714 11.6668 1.66667C11.6668 0.746192 10.9206 0 10.0002 0C9.07969 0 8.3335 0.746192 8.3335 1.66667C8.3335 2.58714 9.07969 3.33333 10.0002 3.33333Z"
        fill="currentColor"
      />
      <path
        d="M10.0002 11.6673C10.9206 11.6673 11.6668 10.9211 11.6668 10.0006C11.6668 9.08018 10.9206 8.33398 10.0002 8.33398C9.07969 8.33398 8.3335 9.08018 8.3335 10.0006C8.3335 10.9211 9.07969 11.6673 10.0002 11.6673Z"
        fill="currentColor"
      />
      <path
        d="M10.0002 19.9994C10.9206 19.9994 11.6668 19.2532 11.6668 18.3327C11.6668 17.4122 10.9206 16.666 10.0002 16.666C9.07969 16.666 8.3335 17.4122 8.3335 18.3327C8.3335 19.2532 9.07969 19.9994 10.0002 19.9994Z"
        fill="currentColor"
      />
    </BaseSvgIcon>
  );
}
