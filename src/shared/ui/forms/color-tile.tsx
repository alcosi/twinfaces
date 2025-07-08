import React from "react";

type Props = {
  color?: string;
};

export function ColorTile({ color }: Props) {
  return (
    <div
      className="h-4 w-4 rounded-sm"
      style={{
        backgroundColor: color,
      }}
    />
  );
}
