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
  disabled,
  counter,
  className,
  buttonClassName,
}: MenuItemProps) {
  const { open } = useSidebar();
  const pathname = usePathname() || "";
  const href = disabled ? undefined : url;
  const isActive = href ? isItemActive(slugify(href), pathname) : false;
  const counterLabel = counter && counter > 0 ? formatCounter(counter) : null;

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

    // No icon configured: the expanded menu shows just the label. The
    // collapsed menu shows icons only, so it keeps a placeholder there to stay
    // visible and clickable.
    if (open) return null;

    return <div className="border-primary h-4 w-4 rounded-md border" />;
  }

  const iconAndLabel = (
    <>
      {open ? (
        renderIcon()
      ) : (
        <span className="relative inline-flex">
          {renderIcon()}
          {counterLabel && (
            <span className="bg-brand-500 ring-sidebar absolute -top-1 -right-1 h-2 w-2 rounded-full ring-2" />
          )}
        </span>
      )}
      {open && <span className="truncate">{label}</span>}
      {open && counterLabel && (
        <span
          aria-label={`${counter} items`}
          className="bg-brand-500/10 text-brand-600 ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-xs leading-none font-semibold tabular-nums"
        >
          {counterLabel}
        </span>
      )}
    </>
  );

  const menuButtonContent = (
    <SidebarMenuButton
      asChild
      className={cn(
        "rounded-lg border border-transparent transition-colors",
        isActive && "bg-brand-500/10 text-brand-600 font-semibold",
        disabled && "pointer-events-none opacity-50",
        buttonClassName
      )}
    >
      {href ? (
        <Link href={href}>{iconAndLabel}</Link>
      ) : (
        <div aria-disabled={disabled || undefined}>{iconAndLabel}</div>
      )}
    </SidebarMenuButton>
  );

  const menuItem = (
    <SidebarMenuItem
      title={label}
      className={cn(
        "w-full list-none",
        href && "cursor-pointer",
        hidden && "hidden",
        className
      )}
    >
      {menuButtonContent}
    </SidebarMenuItem>
  );

  if (!href) {
    return menuItem;
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{menuItem}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          className="cursor-pointer rounded-md"
          onSelect={() => window.open(href, "_blank", "noopener,noreferrer")}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Open in new tab
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function formatCounter(value: number): string {
  return value > 99 ? "99+" : String(value);
}
