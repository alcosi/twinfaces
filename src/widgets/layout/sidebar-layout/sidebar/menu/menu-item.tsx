import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  const isActive = url ? isItemActive(slugify(url), pathname) : false;

  function renderIcon() {
    if (Icon) {
      return <Icon className="w-4 h-4" />;
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

    return <div className="w-4 h-4 border border-primary rounded-md" />;
  }

  const menuButtonContent = (
    <SidebarMenuButton
      className={cn(
        "border border-transparent",
        isActive && "border-link-enabled",
        buttonClassName
      )}
    >
      {renderIcon()}
      {open && <span>{label}</span>}
    </SidebarMenuButton>
  );

  return (
    <SidebarMenuItem
      title={label}
      className={cn(
        "list-none w-full",
        url && "cursor-pointer",
        hidden && "hidden",
        className
      )}
    >
      {url ? (
        <Link
          href={url}
          className={cn("rounded-md", isActive && "text-primary font-bold")}
        >
          {menuButtonContent}
        </Link>
      ) : (
        menuButtonContent
      )}
    </SidebarMenuItem>
  );
}
