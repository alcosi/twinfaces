"use client";

import { X } from "lucide-react";
import React, { ForwardedRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

import { Redefine, cn, fixedForwardRef, isTruthy } from "@/shared/libs";
import { Input } from "@/shared/ui";
import type { ButtonProps } from "@/shared/ui/button";
import { Button } from "@/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

type ColorPickerProps = {
  icon?: React.ReactNode;
  color?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
};

type Props = Redefine<ButtonProps, ColorPickerProps>;

export const ColorPicker = fixedForwardRef(ColorPickerInternal);

export function ColorPickerInternal(
  {
    disabled = false,
    color,
    onChange,
    onBlur,
    name,
    className,
    icon,
    ...rest
  }: Props,
  ref: ForwardedRef<HTMLInputElement>
) {
  const [open, setOpen] = useState(false);

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.stopPropagation();
    onChange?.(e.currentTarget.value);
  }

  function renderIcon() {
    if (isTruthy(color)) return null;

    if (icon) return <span className="size-4 rounded-full">{icon}</span>;

    return <X className="text-destructive h-8 w-8" />;
  }

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild disabled={disabled} onBlur={onBlur}>
        <div className="flex flex-row items-center gap-2">
          <Button
            type="button"
            className={cn("flex", className)}
            name={name}
            onClick={() => {
              setOpen(true);
            }}
            size="icon"
            style={{
              backgroundColor: color,
            }}
            variant="outline"
            {...rest}
          >
            {renderIcon()}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <HexColorPicker color={color} onChange={onChange} />
        <Input
          maxLength={7}
          ref={ref}
          value={color}
          onChange={handleOnChange}
        />
      </PopoverContent>
    </Popover>
  );
}
