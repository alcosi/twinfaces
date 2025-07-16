import { usePathname } from "next/navigation";

import { cn } from "@/shared/libs";
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
import { Group } from "./types";

export function CoreAreaSidebarMenu() {
  const { open } = useSidebar();
  const pathname = usePathname() || "";

  return (
    <SidebarMenu className={cn(!open && "p-2")}>
      {open ? (
        <AccordionMenu pathname={pathname} />
      ) : (
        <CollapsedMenu
          items={Object.values(SIDEBAR_GROUPS).flatMap((group) =>
            group.items.map((item, index) => ({
              item,
              group,
              index,
            }))
          )}
          getItemProps={({ item, group, index }) => {
            const isGroupActive = group.items.some((item) =>
              isItemActive(item.url, pathname)
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

function AccordionMenu({ pathname }: { pathname: string }) {
  const activeGroup =
    Object.values(SIDEBAR_GROUPS).find((group) =>
      group.items.some((item) => isItemActive(item.url, pathname))
    ) ?? SIDEBAR_GROUPS.class;

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full p-2"
      defaultValue={activeGroup?.title.toLowerCase()}
    >
      {Object.values(SIDEBAR_GROUPS).map((group) => (
        <AccordionGroup key={group.title} {...group} />
      ))}
    </Accordion>
  );
}

function AccordionGroup({ title, items }: Group) {
  return (
    <AccordionItem value={title.toLowerCase()} className="border-b-0 px-0">
      <AccordionTrigger className="py-0 text-sm hover:no-underline">
        <SidebarGroupLabel>{title}</SidebarGroupLabel>
      </AccordionTrigger>
      <AccordionContent className="ml-2 list-none border-l border-border py-0 pl-2">
        {items.map((item) => (
          <MenuItem
            key={item.url}
            label={item.title}
            url={item.url}
            Icon={item.icon}
          />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}
