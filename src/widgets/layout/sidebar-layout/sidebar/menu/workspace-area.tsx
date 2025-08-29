import { FaceNB001MenuItem } from "@/entities/face";
import { PlatformArea } from "@/shared/config";
import { cn, isEmptyArray, slugify } from "@/shared/libs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  MarketplacesIcon,
  ProductsIcon,
  SidebarGroupLabel,
  SidebarMenu,
  useSidebar,
} from "@/shared/ui";

import { CollapsedMenu } from "./collapsed-menu";
import { MenuItem } from "./menu-item";

type Props = {
  items: MenuItemWithIcon[];
};

type MenuItemWithIcon = Omit<FaceNB001MenuItem, "icon" | "children"> & {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children?: MenuItemWithIcon[];
};

const WORKSPACE_SIDEBAR_MENU_ITEMS: MenuItemWithIcon[] = [
  {
    key: "products",
    label: "Products",
    icon: ProductsIcon,
    targetPageFaceId: "a3d30213-a3ba-4858-9b5c-ebcaf2060764",
    children: [],
  },
  {
    key: "marketplaces",
    label: "Marketplaces",
    icon: MarketplacesIcon,
    targetPageFaceId: "19a27370-f6f5-4056-9e73-ca2645fae098",
    children: [],
  },
];

const MAX_NESTING_LEVEL = 3;

export function WorkspaceAreaSidebarMenu() {
  const { open } = useSidebar();

  return (
    <SidebarMenu className={cn(!open && "")}>
      {open ? (
        <AccordionMenu items={WORKSPACE_SIDEBAR_MENU_ITEMS} />
      ) : (
        <CollapsedMenu
          items={WORKSPACE_SIDEBAR_MENU_ITEMS}
          getItemProps={(item) => ({
            key: item.key || "",
            label: item.label ?? "N/A",
            url: item.targetPageFaceId
              ? `/${PlatformArea.workspace}/${slugify(item.key)}`
              : undefined,
            Icon: item.icon,
            hidden: false,
            className: "flex items-center justify-center h-10 w-full",
          })}
        />
      )}
    </SidebarMenu>
  );
}

function AccordionMenu({ items }: Props) {
  const renderItems = (
    items: MenuItemWithIcon[],
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
            Icon={item.icon}
            className={cn(`ml-${level * 2}`)}
          />
        );
      }

      return (
        <AccordionItem
          key={keyPath}
          value={keyPath}
          className="border-b-0 px-0"
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
                Icon={item.icon!}
              />
            </SidebarGroupLabel>
          </AccordionTrigger>

          {level + 1 < MAX_NESTING_LEVEL && (
            <AccordionContent
              className={cn("mt-1 py-1", `ml-${(level + 1) * 2}`)}
            >
              <div className="border-border ml-2 border-l">
                {renderItems(item.children!, level, keyPath)}
              </div>
            </AccordionContent>
          )}
        </AccordionItem>
      );
    });
  };

  return (
    <Accordion type="multiple" className="w-full space-y-1 pt-6 pr-2 pl-4">
      {renderItems(items)}
    </Accordion>
  );
}
