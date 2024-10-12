"use client";

import type { ButtonProps } from "@/components/base/button";
import { Button } from "@/components/base/button";
import { Input } from "@/components/base/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/base/popover";
import { cn, fixedForwardRef } from "@/lib/utils";
import { ForwardedRef, useMemo, useState } from "react";
import { HexColorPicker } from "react-colorful";

interface ColorPickerProps {
  value: string;
  // eslint-disable-next-line no-unused-vars
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
  }: Omit<ButtonProps, "value" | "onChange" | "onBlur"> & ColorPickerProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  const [open, setOpen] = useState(false);

  const parsedValue = useMemo(() => {
    return value || "#FFFFFF";
  }, [value]);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild disabled={disabled} onBlur={onBlur}>
        <div className={"flex flex-row gap-2 items-center"}>
          <Button
            {...props}
            type="button"
            className={cn("block", className)}
            name={name}
            onClick={() => {
              setOpen(true);
            }}
            size="icon"
            style={{
              backgroundColor: parsedValue,
            }}
            variant="outline"
          >
            <div />
          </Button>
          {parsedValue}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <HexColorPicker color={parsedValue} onChange={onChange} />
        <Input
          maxLength={7}
          onChange={(e) => {
            onChange?.(e?.currentTarget?.value);
          }}
          ref={ref}
          value={parsedValue}
        />
      </PopoverContent>
    </Popover>
  );
}
