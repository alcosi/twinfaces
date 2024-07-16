import {CopyButton} from "@/components/base/copy-button";
import {Box, Check, Copy} from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/base/tooltip";
import {Button} from "@/components/base/button";

export interface ShortGuidProps {
    value: string | undefined
}

export function ShortGuid({value}:ShortGuidProps) {
    if (!value) return null;
    return <Tooltip>
        <TooltipTrigger asChild>
            <span>{value.substring(0, 8)}...{value.slice(-2)}</span>
        </TooltipTrigger>
        <TooltipContent>
            <span>{value}</span>
        </TooltipContent>
    </Tooltip>
}

export function ShortGuidWithCopy({value}:ShortGuidProps) {
    if (!value) {
        return <></>;
    }
    return <div className="flex flex-row items-center gap-2">
        <ShortGuid value={value}/>
        <CopyButton textToCopy={value}/>
    </div>;
}