import { Dispatch, SetStateAction } from "react";

import { PlatformArea } from "@/shared/config";
import {
  DashboardIcon,
  SettingsIcon,
  SlideView,
  TabsList,
  TabsTrigger,
  useSidebar,
} from "@/shared/ui";

type Props = {
  userLabel: string;
  adminLabel: string;
  area: keyof typeof PlatformArea;
  setArea: Dispatch<SetStateAction<keyof typeof PlatformArea>>;
};

export function PlatformAreaSwitcher({
  userLabel,
  adminLabel,
  area,
  setArea,
}: Props) {
  const { open } = useSidebar();

  function toggleArea() {
    setArea((prev) => (prev === "workspace" ? "core" : "workspace"));
  }

  return (
    <TabsList className="w-full rounded-none">
      {open ? (
        <>
          <TabsTrigger
            className="flex-1 gap-1.5"
            value={PlatformArea.workspace}
            onClick={() => setArea("workspace")}
          >
            <DashboardIcon />
            <span>{userLabel}</span>
          </TabsTrigger>
          <TabsTrigger
            className="flex-1 gap-1.5"
            value={PlatformArea.core}
            onClick={() => setArea("core")}
          >
            <SettingsIcon />
            <span>{adminLabel}</span>
          </TabsTrigger>
        </>
      ) : (
        <SlideView
          className="w-10 h-7"
          activeIndex={area === PlatformArea.workspace ? 0 : 1}
        >
          <TabsTrigger
            key={PlatformArea.workspace}
            value={area}
            onClick={toggleArea}
          >
            <DashboardIcon />
          </TabsTrigger>
          <TabsTrigger
            key={PlatformArea.core}
            value={area}
            onClick={toggleArea}
          >
            <SettingsIcon />
          </TabsTrigger>
        </SlideView>
      )}
    </TabsList>
  );
}
