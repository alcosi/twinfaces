import React from "react";

import { cn } from "@/shared/libs";
import { BaseSvgIcon, IconProps } from "@/shared/ui";

export function PermissionSchemaIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement> & IconProps) {
  return (
    <BaseSvgIcon className={cn(className)} viewBox="0 0 256 256" {...props}>
      <path d="M207.99414,76h-32V52a48,48,0,1,0-96,0V76h-32a20.02292,20.02292,0,0,0-20,20V208a20.02292,20.02292,0,0,0,20,20h160a20.02292,20.02292,0,0,0,20-20V96A20.02292,20.02292,0,0,0,207.99414,76Zm-104-24a24,24,0,1,1,48,0V76h-48Zm100,152h-152V100h152Zm-76-92a31.99519,31.99519,0,0,0-12,61.65674V180a12,12,0,1,0,24,0v-6.34326a31.99519,31.99519,0,0,0-12-61.65674Zm0,24a8,8,0,1,1-8,8A8.00917,8.00917,0,0,1,127.99414,136Z" />
    </BaseSvgIcon>
  );
}
