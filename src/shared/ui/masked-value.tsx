"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { UNICODE_SYMBOLS } from "../libs";
import { Button } from "./button";

export function MaskedValue({ value }: { value: string }) {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <div className="flex max-w-full flex-1 items-center justify-between">
      <span className="overflow-hidden whitespace-nowrap">
        {visible ? value : UNICODE_SYMBOLS.bullet.repeat(value.length)}
      </span>
      <Button
        size="xs"
        variant="ghost"
        IconComponent={visible ? EyeOff : Eye}
        onClick={(e) => {
          e.stopPropagation();
          setVisible((v) => !v);
        }}
      />
    </div>
  );
}
