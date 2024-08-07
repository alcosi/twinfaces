'use client'

import {Button, ButtonProps} from "@/components/base/button";
import {Check, Copy} from "lucide-react";
import {useState} from "react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/base/tooltip";

interface CopyButtonProps extends ButtonProps {
    textToCopy: string,
    onCopy?: () => any,
    copiedText?: string
}

export function CopyButton({textToCopy, onClick, onCopy, copiedText, ...props}: CopyButtonProps) {
    const [copied, setCopied] = useState<boolean>(false);

    function onClickInternal(e: any) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
            onCopy?.()
        })
        onClick?.(e);
    }

    return <>
        <Tooltip open={copied}>
            <TooltipTrigger asChild>
                <Button onClick={onClickInternal} size='iconTiny' variant='ghost' {...props}>
                    {!copied && <Copy/>}
                    {copied && <Check/>}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                {copiedText ?? 'Copied!'}
            </TooltipContent>
        </Tooltip>
    </>
}