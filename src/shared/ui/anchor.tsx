import React, { PropsWithChildren } from "react";

import { CopyButton } from "@/shared/ui/copy-button";

import { cn } from "../libs";

type Props = React.HTMLProps<HTMLAnchorElement> & {
  href: string;
};

export function Anchor({
  href,
  className,
  children,
  ...props
}: PropsWithChildren<Props>) {
  return (
    <a
      href={href}
      className={cn(
        "text-brand hover:underline group-hover:underline",
        className
      )}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {children}
    </a>
  );
}

export function AnchorWithCopy({
  href,
  children,
  ...props
}: PropsWithChildren<Props>) {
  return (
    <div className="group flex items-center">
      <Anchor href={href} {...props}>
        {children}
      </Anchor>
      <CopyButton
        textToCopy={href}
        className="transform -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
      />
    </div>
  );
}
