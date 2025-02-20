import { cn } from "@/shared/libs";
import React, { PropsWithChildren } from "react";

export type IconProps = {
  className?: string;
};

type Props = React.SVGProps<SVGSVGElement> &
  IconProps & {
    viewBox?: string;
  };

export function BaseSvgIcon({
  children,
  className,
  viewBox,
  ...props
}: PropsWithChildren<Props>) {
  return (
    <svg
      className={cn("w-4 h-4 fill-current stroke-current", className)}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid"
      {...props}
    >
      {children}
    </svg>
  );
}
