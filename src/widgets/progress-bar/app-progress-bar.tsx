"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Progress } from "@/shared/ui";

export function AppProgressBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    setProgress(60);
    setHidden(false);

    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setHidden(true);
        setProgress(0);
      }, 200);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);

  return <Progress value={progress} hidden={hidden} />;
}
