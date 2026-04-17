import { DatabaseZap } from "lucide-react";
import { toast } from "sonner";

import { useDropCache } from "@/entities/system";
import { Button } from "@/shared/ui";

export function DropCacheButton() {
  const { dropCache } = useDropCache();

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
