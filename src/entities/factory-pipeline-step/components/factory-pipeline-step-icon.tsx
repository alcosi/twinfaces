import { BaseSvgIcon, IconProps } from "@/shared/ui";
import React from "react";

export function FactoryPipelineStepIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement> & IconProps) {
  return (
    <BaseSvgIcon className={className} viewBox="0 0 512 512" {...props}>
      <polygon points="311.237,83.453 311.237,225.912 140.574,225.912 140.574,368.357 0,368.357 0,428.547 200.757,428.547 200.757,286.088 371.42,286.088 371.42,143.631 512,143.631 512,83.453 " />
    </BaseSvgIcon>
  );
}
