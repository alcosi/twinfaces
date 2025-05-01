import { FaceNB001, FaceNB001MenuItem } from "@/entities/face";
import { PlatformArea } from "@/shared/config";
import { cn, isEmptyArray, slugify } from "@/shared/libs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  SidebarGroupLabel,
  SidebarMenu,
  useSidebar,
} from "@/shared/ui";

import { CollapsedMenu } from "./collapsed-menu";
import { MenuItem } from "./menu-item";

type Props = {
  items: NonNullable<FaceNB001["userAreaMenuItems"]>;
};

const MAX_NESTING_LEVEL = 3;

export function WorkspaceAreaSidebarMenu({ items }: Props) {
  const { open } = useSidebar();

  return (
    <SidebarMenu className={cn(!open && "p-2")}>
      {open ? (
        <AccordionMenu items={items} />
      ) : (
        <CollapsedMenu
          items={items}
          getItemProps={(item) => ({
            key: item.key || "",
            label: item.label ?? "N/A",
            url: item.targetPageFaceId
              ? `/${PlatformArea.workspace}/${slugify(item.key)}`
              : undefined,
            iconSource: item.icon,
            hidden: false,
          })}
        />
      )}
    </SidebarMenu>
  );
}

function AccordionMenu({ items }: Props) {
  const renderItems = (
    items: FaceNB001MenuItem[],
    level = 0,
    parentKey = "root"
  ) => {
    return items.map((item) => {
      const keyPath = `${parentKey}-${item.key}`;
      const url = item.targetPageFaceId
        ? `/${PlatformArea.workspace}/${slugify(item.key)}`
        : undefined;

      if (isEmptyArray(item.children)) {
        return (
          <MenuItem
            key={keyPath}
            label={item.label!}
            url={url}
            iconSource={item.icon ?? ""}
            className={cn("px-2", `ml-${level * 2}`)}
          />
        );
      }

      return (
        <AccordionItem
          key={keyPath}
          value={keyPath}
          className="px-0 border-b-0"
        >
          <AccordionTrigger
            className={cn(
              "py-0 text-sm hover:no-underline",
              `relative`,
              `ml-${level * 2}`
            )}
          >
            <SidebarGroupLabel className="w-full">
              <MenuItem
                label={item.label ?? "N/A"}
                url={url}
                iconSource={item.icon!}
              />
            </SidebarGroupLabel>
          </AccordionTrigger>

          {level + 1 < MAX_NESTING_LEVEL && (
            <AccordionContent
              className={cn("mt-1 py-1", `ml-${(level + 1) * 2}`)}
            >
              <div className="border-l border-border ml-2">
                {renderItems(item.children!, level, keyPath)}
              </div>
            </AccordionContent>
          )}
        </AccordionItem>
      );
    });
  };

  return (
    <Accordion type="multiple" className="w-full p-0 pt-2 space-y-1">
      {renderItems(items)}
    </Accordion>
  );
}
