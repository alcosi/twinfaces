"use client";

import { DatalistOptionScreen } from "@/screens/datalist-option";

interface DatalistOptionPageProps {
  params: {
    optionId: string;
  };
}

export default function DatalistOptionPage({
  params: { optionId },
}: DatalistOptionPageProps) {
  return <DatalistOptionScreen optionId={optionId} />;
}
