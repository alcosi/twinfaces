import { PropsWithChildren } from "react";

import { GuidWithCopy } from "@/shared/ui/guid";

interface Props {
  // src | href
  value: string;
}

// TODO: remove
export function GuidLink({ value }: Props) {
  return (
    <div onClick={(event) => event.stopPropagation()}>
      <a href={value} className="text-brand hover:underline">
        <GuidWithCopy value={value} />
      </a>
    </div>
  );
}

export function Anchor({
  href,
  children,
}: PropsWithChildren<{ href: string }>) {
  return (
    <a href={href} className="text-brand hover:underline">
      {children}
    </a>
  );
}

// TODO: refactor
export function AnchorWithCopy({
  href,
  children,
}: PropsWithChildren<{ href: string }>) {
  return (
    <>
      <a href={href} className="text-brand hover:underline">
        {children}
        {/* <CopyButton textToCopy={value} disableTooltip={disableTooltip} /> */}
      </a>
    </>
  );
}
