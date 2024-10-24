import { Button } from "@/components/base/button";
import { isFullString, stopPropagation } from "@/shared/libs";
import { Avatar } from "@/shared/ui";
import { Copy, User as UserIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { User } from "../../libs";

type Props = {
  data: User;
};

export function UserResourceTooltip({ data }: Props) {
  function handleCopyUUID(e: React.MouseEvent) {
    stopPropagation(e);
    navigator.clipboard.writeText(data.id ?? "").then(() => {
      toast.message("UUID is copied");
    });
  }

  return (
    <div
      className="text-sm w-96 p-6 space-y-4"
      onClick={stopPropagation}
      style={{
        background:
          "linear-gradient(to bottom, #3b82f6 96px, transparent 96px)",
      }}
    >
      <header className="flex h-24 gap-x-4 text-primary-foreground">
        <div className="h-24 w-24 rounded-full bg-muted text-link-light-active dark:text-link-dark-active flex justify-center items-center">
          {data.avatar ? (
            <Avatar
              url={data.avatar}
              alt={data.fullName ?? "Avatar"}
              size="xlg"
            />
          ) : (
            <UserIcon className="w-16 h-16" />
          )}
        </div>

        <div className="flex flex-col justify-end h-16">
          <div className="font-semibold text-lg">
            {isFullString(data.fullName) ? data.fullName : "N/A"}
          </div>
          <div className="text-sm">{data.email}</div>
        </div>
      </header>

      <footer className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="flex flex-row gap-2 items-center hover:bg-secondary w-1/2 p-0.5"
          onClick={handleCopyUUID}
        >
          <Copy className="h-4 w-4" />
          Copy UUID
        </Button>
      </footer>
    </div>
  );
}
