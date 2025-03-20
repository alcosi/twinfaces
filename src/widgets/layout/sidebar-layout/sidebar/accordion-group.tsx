import Link from "next/link";

import { cn } from "@/shared/libs";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubItem,
} from "@/shared/ui";

import { Group } from "./group";

export function AccordionGroupSection({ title, items }: Group) {
  return (
    <AccordionItem value={title.toLowerCase()} className="px-0 border-b-0">
      <AccordionTrigger className="py-0 text-sm hover:no-underline">
        <SidebarGroupLabel>{title}</SidebarGroupLabel>
      </AccordionTrigger>
      <AccordionContent className="list-none border-l ml-2 py-0 pl-2">
        {items.map((item, index) => (
          <SidebarMenuSubItem key={item.url}>
            <Link
              href={item.url}
              className="flex items-center gap-2 rounded-md"
            >
              <SidebarMenuButton>
                <item.icon
                  className={cn("w-4 h-4")}
                  //   strokeWidth={isActive ? 3 : undefined}
                />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuSubItem>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}
