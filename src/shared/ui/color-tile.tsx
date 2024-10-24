import React from "react";

type Props = {
  color?: string;
};

export function ColorTile({ color }: Props) {
  return (
    <div
      className="w-4 h-4 rounded"
      style={{
        backgroundColor: color,
      }}
    />
  );
}
