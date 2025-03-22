import React from "react";

import { cn } from "@/shared/libs";

export interface ISVGProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export function LoadingSpinner({ size = 24, className, ...props }: ISVGProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin", className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 z-30 bg-black/80 flex items-center justify-center">
      <LoadingSpinner size={48} className="text-white" />
    </div>
  );
}
