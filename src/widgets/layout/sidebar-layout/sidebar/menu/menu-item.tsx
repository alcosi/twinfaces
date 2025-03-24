import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { OneOf, cn } from "@/shared/libs";
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/shared/ui";

import { isItemActive } from "./helpers";
import { ComponentIconItem, UrlIconItem } from "./types";

type Props = OneOf<[ComponentIconItem | UrlIconItem]>;

export function MenuItem({
  label,
  url,
  iconSource,
  Icon,
  hidden,
  buttonClassName,
}: Props) {
  const { open } = useSidebar();
  const pathname = usePathname() || "";
  const isActive = isItemActive(url, pathname);

  return (
    <SidebarMenuItem title={label} className={cn(hidden && "hidden")}>
      <Link
        href={url}
        className={cn("rounded-md", isActive && "text-primary font-bold")}
      >
        <SidebarMenuButton
          className={cn(
            "border border-transparent",
            isActive && "border-link-light-active dark:border-link-dark-active",
            buttonClassName
          )}
        >
          {Icon ? (
            <Icon className="w-4 h-4" />
          ) : (
            <Image
              src={iconSource}
              alt={label || "icon"}
              width={16}
              height={16}
              className="dark:invert"
            />
          )}
          {open && <span>{label}</span>}
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  );
}
