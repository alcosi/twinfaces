import React from "react";

import { BaseSvgIcon, IconProps } from "@/shared/ui";

export function TableIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement> & IconProps) {
  return (
    <BaseSvgIcon className={className} viewBox="0 0 24 24" {...props}>
      <path
        strokeWidth="2"
        fill="none"
        d="M12 10V20M3 15L21 15M3 10H21M6.2 20H17.8C18.9201 20 19.4802 20 19.908 19.782C20.2843 19.5903 20.5903 19.2843 20.782 18.908C21 18.4802 21 17.9201 21 16.8V7.2C21 6.0799 21 5.51984 20.782 5.09202C20.5903 4.71569 20.2843 4.40973 19.908 4.21799C19.4802 4 18.9201 4 17.8 4H6.2C5.0799 4 4.51984 4 4.09202 4.21799C3.71569 4.40973 3.40973 4.71569 3.21799 5.09202C3 5.51984 3 6.07989 3 7.2V16.8C3 17.9201 3 18.4802 3.21799 18.908C3.40973 19.2843 3.71569 19.5903 4.09202 19.782C4.51984 20 5.07989 20 6.2 20Z"
      />
    </BaseSvgIcon>
  );
}

export function TableAddColumnIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement> & IconProps) {
  return (
    <BaseSvgIcon className={className} viewBox="0 0 1920 1920" {...props}>
      <path d="M120 180v1560c0 33 26.88 60 60 60h1020V120H180c-33.12 0-60 27-60 60Zm1620-60h-420v480h480V180c0-33-26.88-60-60-60Zm60 600h-480v480h480V720Zm-60 1080c33.12 0 60-27 60-60v-420h-480v480h420ZM180 1920c-99.24 0-180-80.76-180-180V180C0 80.76 80.76 0 180 0h1560c99.24 0 180 80.76 180 180v1560c0 99.24-80.76 180-180 180H180Zm596.484-510h-240v-330h-330V840h330V510h240v330h330v240h-330v330Z" />
    </BaseSvgIcon>
  );
}

export function TableAddRowIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement> & IconProps) {
  return (
    <BaseSvgIcon className={className} viewBox="0 0 1920 1920" {...props}>
      <path d="M1740 120H180c-33 0-60 26.88-60 60v1020h1680V180c0-33.12-27-60-60-60Zm60 1620v-420h-480v480h420c33 0 60-26.88 60-60Zm-600 60v-480H720v480h480Zm-1080-60c0 33.12 27 60 60 60h420v-480H120v420ZM0 180C0 80.76 80.76 0 180 0h1560c99.24 0 180 80.76 180 180v1560c0 99.24-80.76 180-180 180H180c-99.24 0-180-80.76-180-180V180Zm510 596.484v-240h330v-330h240v330h330v240h-330v330H840v-330H510Z" />
    </BaseSvgIcon>
  );
}
