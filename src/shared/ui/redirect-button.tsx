import Link from "next/link";
import React from "react";

import { Button } from "@/shared/ui/button";
import { DashboardIcon, SettingsIcon } from "@/shared/ui/icons";

export function RedirectButton({
  isCorePath,
  linkHref,
}: {
  isCorePath?: boolean;
  linkHref: string;
}) {
  return (
    <div className="absolute bottom-8 right-7 z-50 rounded-md border bg-secondary dark:bg-background shadow-lg">
      <Link href={linkHref}>
        <Button variant="ghost" size={"icon"} title="View as Admin">
          {isCorePath ? (
            <DashboardIcon className="w-6 h-6" />
          ) : (
            <SettingsIcon className="w-6 h-6" />
          )}
        </Button>
      </Link>
    </div>
  );
}
