import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn, slugify } from "@/shared/libs";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/ui";

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

  const iconAndLabel = (
    <>
      {renderIcon()}
      {open && <span>{label}</span>}
    </>
  );

  const menuButtonContent = (
    <SidebarMenuButton
      asChild
      className={cn(
        "rounded-lg border border-transparent transition-colors",
        isActive && "bg-brand-500/10 text-brand-600 font-semibold",
        buttonClassName
      )}
    >
      {url ? <Link href={url}>{iconAndLabel}</Link> : <div>{iconAndLabel}</div>}
    </SidebarMenuButton>
  );

  const menuItem = (
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

  if (!url) {
    return menuItem;
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{menuItem}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          className="cursor-pointer rounded-md"
          onSelect={() => window.open(url, "_blank", "noopener,noreferrer")}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Open in new tab
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
