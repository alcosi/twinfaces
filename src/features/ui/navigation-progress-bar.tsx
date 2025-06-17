"use client";

import { useEffect, useState } from "react";

import { Progress } from "@/shared/ui";

export function NavigationProgressBar() {
  const [progress, setProgress] = useState<number>(0);
  const [isHidden, setHidden] = useState<boolean>(true);

  useEffect(() => {
    setHidden(false);
    setProgress(30);

    const timer1 = setTimeout(() => setProgress(60), 200);
    const timer2 = setTimeout(() => setProgress(90), 600);

    return () => {
      setHidden(true);
      setProgress(100);

      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <Progress value={progress} hidden={isHidden} className="absolute z-50" />
  );
}
