import { PlatformArea } from "@/shared/config";
import { SidebarMenu } from "@/shared/ui";

import { MenuItem } from "./menu-item";

type Props = {
  items: {
    label?: string;
    key?: string;
    icon?: string;
  }[];
};

const DEFAULT_ICON_SOURCE =
  "https://www.svgrepo.com/show/478711/question-mark.svg";

export function WorkspaceAreaSidebarMenu({ items }: Props) {
  return (
    <SidebarMenu className="p-2">
      {items?.map((item) => (
        <MenuItem
          key={item.key}
          label={`${item.label}`}
          url={`/${PlatformArea.workspace}/${item.key!}`}
          iconSource={item.icon ?? DEFAULT_ICON_SOURCE}
        />
      ))}
    </SidebarMenu>
  );
}
