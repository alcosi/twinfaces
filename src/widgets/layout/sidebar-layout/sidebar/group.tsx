import { cn } from "@/shared/libs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/shared/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ElementType } from "react";

type SidebarGroupItem = {
  title: string;
  url: string;
  icon: ElementType;
};

export type GroupKeys =
  | "class"
  | "twin"
  | "flow"
  | "user"
  | "permission"
  | "misc";

export type Group = {
  title: string;
  items: SidebarGroupItem[];
};

export function GroupSection({ group }: { group: Group }) {
  const { open } = useSidebar();
  const pathname = usePathname() || "";

  const isActiveGroup = group.items.some((item) =>
    new RegExp(`^${item.url}(/|$)`).test(pathname)
  );

  const renderItems = (isCompact: boolean) => {
    const ItemComponent = isCompact ? SidebarMenuItem : SidebarMenuSubItem;

    return group.items.map((item, index) => {
      const isActive = new RegExp(`^${item.url}(/|$)`).test(pathname);
      const isVisible = isActiveGroup || index === 0 || !isCompact;

      return (
        <ItemComponent
          key={item.url}
          title={item.title}
          className={cn(isCompact && !isVisible && "hidden")}
        >
          <Link
            href={item.url}
            className={cn(
              "flex items-center gap-2 rounded-md",
              isActive && "text-primary font-bold",
              isActiveGroup && isCompact && "bg-sidebar-accent"
            )}
          >
            <SidebarMenuButton>
              <item.icon
                className={cn("w-4 h-4", isActive && "stroke-[3px]")}
              />
              {!isCompact && <span>{item.title}</span>}
            </SidebarMenuButton>
          </Link>
        </ItemComponent>
      );
    });
  };

  const renderCollapsibleContent = () => (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarMenuBadge>
              <ChevronRight
                className={cn(
                  "w-4 h-4 ml-auto transition-transform",
                  "group-data-[state=open]/collapsible:rotate-90"
                )}
              />
            </SidebarMenuBadge>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="text-sm">
            {renderItems(false)}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );

  return (
    <SidebarGroup>
      <SidebarMenu>
        {open ? renderCollapsibleContent() : renderItems(true)}
      </SidebarMenu>
    </SidebarGroup>
  );
}
