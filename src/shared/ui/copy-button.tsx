"use client";

import { Button, ButtonProps } from "@/shared/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface CopyButtonProps extends ButtonProps {
  textToCopy: string;
  onCopy?: () => any;
  copiedText?: string;
  disableTooltip?: boolean;
}

export function CopyButton({
  textToCopy,
  onClick,
  onCopy,
  copiedText,
  disableTooltip = false,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState<boolean>(false);

  function onClickInternal(e: any) {
    e.stopPropagation();
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopy?.();
    });
    onClick?.(e);
  }

  const trigger = (
    <Button onClick={onClickInternal} size="iconS6" variant="ghost" {...props}>
      {!copied && <Copy />}
      {copied && <Check />}
    </Button>
  );

  return disableTooltip ? (
    trigger
  ) : (
    <>
      <Tooltip open={copied}>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent>{copiedText ?? "Copied!"}</TooltipContent>
      </Tooltip>
    </>
  );
}
