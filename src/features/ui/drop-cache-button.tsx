import { DatabaseZap } from "lucide-react";
import { toast } from "sonner";

import { useDropCache } from "@/entities/system";
import { usePermissionsAccess } from "@/shared/libs/hooks/use-permissions-access";
import { Button } from "@/shared/ui";

const SYSTEM_CACHE_EVICT_KEY = "SYSTEM_CACHE_EVICT";

export function DropCacheButton() {
  const { dropCache } = useDropCache();
  const { hasPermissionKey } = usePermissionsAccess();

  if (!hasPermissionKey(SYSTEM_CACHE_EVICT_KEY)) {
    return null;
  }

  const dropCacheHandler = async () => {
    await dropCache();

    toast.success("Caches droped successfully!");
  };

  return (
    <Button
      variant="outline"
      onClick={dropCacheHandler}
      IconComponent={DatabaseZap}
      title="Drop all caches"
    />
  );
}
