import Link from "next/link";

import { PlatformArea } from "@/shared/config";
import { Button } from "@/shared/ui/button";
import { SettingsIcon } from "@/shared/ui/icons";

/**
 * Navigates from Twin's Workspace view to Core (admin) view.
 * Currently supports only Core redirection due to lack of dynamic route detection.
 */
export function ViewAsAdminButton({ twinId }: { twinId: string }) {
  const href = `/${PlatformArea.core}/twins/${twinId}`;

  return (
    <Link
      href={href}
      target="_blank"
      className="absolute bottom-6 right-6 z-50 rounded-md border bg-secondary shadow-sm"
    >
      <Button variant="ghost" size={"icon"} title="View as Admin">
        <SettingsIcon className="h-6 w-6" />
      </Button>
    </Link>
  );
}
