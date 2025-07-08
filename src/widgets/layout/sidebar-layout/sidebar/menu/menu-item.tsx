import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { cn, slugify } from "@/shared/libs";
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/shared/ui";

import { isItemActive } from "./helpers";
import { MenuItemProps } from "./types";

export function MenuItem({
  label,
  url,
  iconSource,
  Icon,
  hidden,
  className,
  buttonClassName,
}: MenuItemProps) {
  const { open } = useSidebar();
  const pathname = usePathname() || "";
  const router = useRouter();
  const isActive = url ? isItemActive(slugify(url), pathname) : false;

  function renderIcon() {
    if (Icon) {
      return <Icon className="h-4 w-4" />;
    }

    if (iconSource) {
      return (
        <Image
          src={iconSource}
          alt={label || "icon"}
          width={16}
          height={16}
          className="dark:invert"
        />
      );
    }

    return <div className="border-primary h-4 w-4 rounded-md border" />;
  }

  const menuButtonContent = (
    <SidebarMenuButton
      asChild
      onClick={url ? () => router.push(url) : undefined}
      className={cn(
        "rounded-md border border-transparent",
        isActive && "border-link-enabled text-primary font-bold",
        buttonClassName
      )}
    >
      <div>
        {renderIcon()}
        {open && <span>{label}</span>}
      </div>
    </SidebarMenuButton>
  );

  return (
    <SidebarMenuItem
      title={label}
      className={cn(
        "w-full list-none",
        url && "cursor-pointer",
        hidden && "hidden",
        className
      )}
    >
      {menuButtonContent}
    </SidebarMenuItem>
  );
}
