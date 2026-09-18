"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

import { cn } from "@/shared/libs";

/**
 * Lets a layer opened *inside* a tooltip — a dropdown menu, in practice — hold
 * that tooltip open for as long as it is itself open.
 *
 * Without it the two fight each other. On leaving the tooltip's own box Radix
 * builds a "grace area": a polygon between the point the pointer left at and
 * the trigger, and the first pointer move outside it closes the tooltip. A menu
 * hanging below or beside the tooltip is in the opposite direction, so reaching
 * for one of its items leaves that polygon and takes the menu down with the
 * tooltip it was rendered in. Whether it happens at all depends on which way
 * Radix flipped the menu, which is why it looks intermittent.
 */
const TooltipLockContext = React.createContext<
  ((locked: boolean) => void) | undefined
>(undefined);

function TooltipLockProvider({
  onLockChange,
  children,
}: {
  onLockChange: (locked: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <TooltipLockContext.Provider value={onLockChange}>
      {children}
    </TooltipLockContext.Provider>
  );
}

/** The lock of the tooltip this subtree is rendered in, if it is in one. */
function useTooltipLock() {
  return React.useContext(TooltipLockContext);
}

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-30 overflow-hidden rounded-md px-3 py-1.5 text-sm shadow-md",
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-popover fill-popover z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipLockProvider,
  useTooltipLock,
};
