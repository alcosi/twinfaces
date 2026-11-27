import { usePathname } from "next/navigation";

import { cn } from "@/shared/libs";
import {
  getCoreRouteSegment,
  getPermissionKeysForCoreRouteAction,
  hasAnyPermissionKey,
  usePermissionsAccess,
} from "@/shared/libs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  SidebarGroupLabel,
  SidebarMenu,
  useSidebar,
} from "@/shared/ui";

import { SIDEBAR_GROUPS } from "../constants";
import { CollapsedMenu } from "./collapsed-menu";
import { isItemActive } from "./helpers";
import { MenuItem } from "./menu-item";
import { Group, GroupItem } from "./types";

export function CoreAreaSidebarMenu() {
  const { open } = useSidebar();
  const pathname = usePathname() || "";
  const { permissionKeys } = usePermissionsAccess();
  const routeSegment = getCoreRouteSegment(pathname);

  const filterItemByPermission = (item: { url: string }): boolean => {
    const manageKeys = getPermissionKeysForCoreRouteAction({
      pathname: item.url,
      action: "MANAGE",
    });
    if (manageKeys.length === 0) return true;

    return hasAnyPermissionKey({
      permissionKeys,
      keysToCheck: manageKeys,
    });
  };

  const filteredGroups = Object.values(SIDEBAR_GROUPS)
    .map((group) => ({
      ...group,
      items: group.items.filter(filterItemByPermission).map((item) => {
        if (!item.children) return item;

        const filteredChildren = item.children.filter(filterItemByPermission);
        return filteredChildren.length > 0
          ? { ...item, children: filteredChildren }
          : { ...item, children: undefined };
      }),
    }))
    .filter((group) => group.items.length > 0);

  if (filteredGroups.length === 0) {
    return null;
  }

  return (
    <SidebarMenu className={cn(!open && "p-2")}>
      {open ? (
        <AccordionMenu
          pathname={pathname}
          groups={filteredGroups}
          fallbackSegment={routeSegment}
        />
      ) : (
        <CollapsedMenu
          items={filteredGroups.flatMap((group) =>
            group.items.flatMap((item, index) => {
              const flatItems = [
                { item, group, index },
                ...(item.children?.map((child) => ({
                  item: child,
                  group,
                  index,
                })) ?? []),
              ];
              return flatItems;
            })
          )}
          getItemProps={({ item, group, index }) => {
            const isGroupActive =
              group.items.some((i) => isItemActive(i.url, pathname)) ||
              group.items.some((i) =>
                i.children?.some((c) => isItemActive(c.url, pathname))
              );

            return {
              key: item.url,
              label: item.title,
              url: item.url,
              Icon: item.icon,
              hidden: !isGroupActive && index !== 0,
              buttonClassName: isGroupActive ? "bg-sidebar-accent" : undefined,
            };
          }}
        />
      )}
    </SidebarMenu>
  );
}

function AccordionMenu({
  pathname,
  groups,
  fallbackSegment,
}: {
  pathname: string;
  groups: Group[];
  fallbackSegment?: string;
}) {
  const activeGroup =
    groups.find((group) =>
      group.items.some(
        (item) =>
          isItemActive(item.url, pathname) ||
          item.children?.some((child) => isItemActive(child.url, pathname))
      )
    ) ??
    (fallbackSegment
      ? groups.find((group) =>
          group.items.some((item) => item.url.includes(`/${fallbackSegment}`))
        )
      : undefined) ??
    groups[0];

  // Same look as the user area menu (WorkspaceAreaSidebarMenu): group rows
  // with an icon, children indented behind a left rule.
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full space-y-1 p-0 pt-2"
      defaultValue={activeGroup?.title.toLowerCase() ?? ""}
    >
      {groups.map((group) => (
        <AccordionGroup key={group.title} {...group} />
      ))}
    </Accordion>
  );
}

const LEAF_ITEM_CLASS = "text-sidebar-foreground/70 px-2 font-medium";

function AccordionGroup({ title, items }: Group) {
  const pathname = usePathname() || "";
  // The collapsed sidebar represents a group by its first item, so the
  // expanded group header uses that item's icon too.
  const GroupIcon = items[0]?.icon;

  return (
    <AccordionItem value={title.toLowerCase()} className="border-b-0 px-0">
      <AccordionTrigger className="relative py-0 text-sm hover:no-underline">
        <SidebarGroupLabel className="w-full">
          {GroupIcon ? (
            <MenuItem label={title} Icon={GroupIcon} />
          ) : (
            <MenuItem label={title} />
          )}
        </SidebarGroupLabel>
      </AccordionTrigger>
      <AccordionContent className="mt-1 ml-2 py-1">
        <div className="border-border ml-2 border-l">
          {items.map((item) =>
            item.children ? (
              <NestedItem key={item.url} item={item} pathname={pathname} />
            ) : (
              <MenuItem
                key={item.url}
                label={item.title}
                url={item.url}
                Icon={item.icon}
                className={LEAF_ITEM_CLASS}
              />
            )
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function NestedItem({ item, pathname }: { item: GroupItem; pathname: string }) {
  const hasActiveChild = item.children!.some((child) =>
    isItemActive(child.url, pathname)
  );

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={hasActiveChild ? item.url : undefined}
      className="border-b-0"
    >
      <AccordionItem value={item.url} className="border-b-0 px-0">
        <AccordionTrigger className="relative py-0 text-sm hover:no-underline">
          <MenuItem
            label={item.title}
            url={item.url}
            Icon={item.icon}
            className={LEAF_ITEM_CLASS}
          />
        </AccordionTrigger>
        <AccordionContent className="mt-1 ml-2 py-1">
          <div className="border-border ml-2 border-l">
            {item.children!.map((child) => (
              <MenuItem
                key={child.url}
                label={child.title}
                url={child.url}
                Icon={child.icon}
                className={LEAF_ITEM_CLASS}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
