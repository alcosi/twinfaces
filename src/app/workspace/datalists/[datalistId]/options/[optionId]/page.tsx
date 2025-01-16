"use client";

import { OptionScreen } from "@/screens/options";

interface DatalistOptionPageProps {
  params: {
    optionId: string;
  };
}

export default function DatalistOptionPage({
  params: { optionId },
}: DatalistOptionPageProps) {
  return <OptionScreen optionId={optionId} />;
}
