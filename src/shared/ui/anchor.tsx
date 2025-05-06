import { PropsWithChildren } from "react";

import { cn, shortenUUID } from "@/shared/libs";
import { CopyButton } from "@/shared/ui/copy-button";

type Props = {
  href: string;
  variant?: "short" | "long";
};

export function Anchor({
  href,
  variant = "short",
  children,
}: PropsWithChildren<Props>) {
  const isStringChild = typeof children === "string";
  const displayValue =
    variant === "short" && isStringChild ? shortenUUID(children) : children;

  return (
    <a
      href={href}
      className="text-brand hover:underline"
      onClick={(e) => e.stopPropagation()}
    >
      {displayValue}
    </a>
  );
}

export function AnchorWithCopy({
  href,
  variant = "short",
}: PropsWithChildren<Props>) {
  return (
    <div className="relative inline-flex items-center">
      <div className="group flex items-center">
        <Anchor href={href} variant={variant}>
          {href}
        </Anchor>
        <div
          className={cn(
            "flex items-center",
            "ml-1 transform -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
          )}
        >
          <CopyButton textToCopy={href} />
        </div>
      </div>
    </div>
  );
}
