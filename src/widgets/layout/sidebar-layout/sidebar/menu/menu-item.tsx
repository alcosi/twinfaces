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
      return <Icon className={cn("h-6 w-6", isActive && "text-primary")} />;
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

    return <div className="border-primary h-6 w-6 rounded-md border" />;
  }

  const menuButtonContent = (
    <SidebarMenuButton
      asChild
      onClick={url ? () => router.push(url) : undefined}
      className={cn(
        "mb-2 flex w-full items-center gap-2 rounded-md px-[10px] py-5",
        "hover:bg-ons-white-400",
        isActive && "bg-ons-brand-50",
        buttonClassName
      )}
    >
      <div>
        {renderIcon()}
        {open && (
          <span
            className={cn(
              "font-rubik text-base leading-[1.2] font-medium",
              isActive ? "text-primary" : "text-[#0D114E]"
            )}
          >
            {label}
          </span>
        )}
      </div>
    </SidebarMenuButton>
  );

  return (
    <SidebarMenuItem
      title={label}
      className={cn(
        "w-full list-none p-0",
        url && "cursor-pointer",
        hidden && "hidden",
        className
      )}
    >
      {menuButtonContent}
    </SidebarMenuItem>
  );
}
