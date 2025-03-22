import { usePathname } from "next/navigation";

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
import { isItemActive } from "./helpers";
import { MenuItem } from "./menu-item";
import { Group } from "./types";

export function CoreAreaSidebarMenu() {
  const { open } = useSidebar();

  return open ? (
    <SidebarMenu>
      <AccordionMenu />
    </SidebarMenu>
  ) : (
    <SidebarMenu className="p-2">
      <CollapsedMenu />
    </SidebarMenu>
  );
}

function AccordionMenu() {
  return (
    <Accordion type="single" collapsible className="w-full p-2">
      {Object.values(SIDEBAR_GROUPS).map((group) => (
        <AccordionGroup key={group.title} {...group} />
      ))}
    </Accordion>
  );
}

function AccordionGroup({ title, items }: Group) {
  return (
    <AccordionItem value={title.toLowerCase()} className="px-0 border-b-0">
      <AccordionTrigger className="py-0 text-sm hover:no-underline">
        <SidebarGroupLabel>{title}</SidebarGroupLabel>
      </AccordionTrigger>
      <AccordionContent className="list-none border-l ml-2 py-0 pl-2">
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

function CollapsedMenu() {
  const pathname = usePathname() || "";

  return Object.values(SIDEBAR_GROUPS).flatMap(({ items }) => {
    const isGroupActive = items.some((item) =>
      isItemActive(item.url, pathname)
    );

    return items.map((item, index) => (
      <MenuItem
        key={item.url}
        label={item.title}
        url={item.url}
        Icon={item.icon}
        hidden={!isGroupActive && index !== 0}
        buttonClassName={isGroupActive ? "bg-sidebar-accent" : undefined}
      />
    ));
  });
}
