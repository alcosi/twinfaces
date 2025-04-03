"use client";

import { POSITION_MAP } from "../libs";

type Props = {
  text: string;
  position?: "top-left" | "top-right" | "bottom-right" | "bottom-left";
};

export function Caption({ text, position = "bottom-left" }: Props) {
  const positionClass = POSITION_MAP[position];

  return (
    <div
      className={`absolute ${positionClass} m-2 rounded-md bg-primary p-1 text-center text-xs text-secondary`}
    >
      {text}
    </div>
  );
}
