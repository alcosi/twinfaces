"use client";

import { X } from "lucide-react";
import { ForwardedRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

import { Redefine, cn, fixedForwardRef, isUndefined } from "@/shared/libs";
import { Input } from "@/shared/ui";
import type { ButtonProps } from "@/shared/ui/button";
import { Button } from "@/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

interface ColorPickerProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
}

export const ColorPicker = fixedForwardRef(ColorPickerInternal);

export function ColorPickerInternal(
  {
    disabled,
    value,
    onChange,
    onBlur,
    name,
    className,
    ...props
  }: Redefine<ButtonProps, ColorPickerProps>,
  ref: ForwardedRef<HTMLInputElement>
) {
  const [open, setOpen] = useState(false);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild disabled={disabled} onBlur={onBlur}>
        <div className={"flex flex-row gap-2 items-center"}>
          <Button
            {...props}
            type="button"
            className={cn("flex", className)}
            name={name}
            onClick={() => {
              setOpen(true);
            }}
            size="icon"
            style={{
              backgroundColor: value,
            }}
            variant="outline"
          >
            {isUndefined(value) && <X className="h-8 w-8 text-destructive" />}
          </Button>
          {value}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <HexColorPicker color={value} onChange={onChange} />
        <Input
          maxLength={7}
          onChange={(e) => {
            onChange?.(e?.currentTarget?.value);
          }}
          ref={ref}
          value={value}
        />
      </PopoverContent>
    </Popover>
  );
}
