import { Dispatch, SetStateAction, useState } from "react";

import { PlatformArea } from "@/shared/config";
import {
  MainIcon,
  SettingsIcon,
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
  const [isSliding, setIsSliding] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "left"
  );

  function toggleArea() {
    setSlideDirection(area === "workspace" ? "left" : "right");
    setIsSliding(true);

    setTimeout(() => {
      setArea((prev) => (prev === "workspace" ? "core" : "workspace"));
      setIsSliding(false);
    }, 300);
  }

  return (
    <TabsList className="w-full rounded-none">
      {open ? (
        <>
          <TabsTrigger
            className="flex-1 gap-1.5"
            value={PlatformArea.workspace}
            onClick={toggleArea}
          >
            <MainIcon />
            <span>{userLabel}</span>
          </TabsTrigger>
          <TabsTrigger
            className="flex-1 gap-1.5"
            value={PlatformArea.core}
            onClick={toggleArea}
          >
            <SettingsIcon />
            <span>{adminLabel}</span>
          </TabsTrigger>
        </>
      ) : (
        // VARIANT 1
        <TabsTrigger value={area} className="" onClick={toggleArea}>
          {area === "workspace" ? (
            <MainIcon className="transition-opacity duration-200" />
          ) : (
            <SettingsIcon className="transition-opacity duration-200" />
          )}
        </TabsTrigger>

        // VARIANT 2
        // <TabsTrigger
        //   value={workspace}
        //   className="relative w-8 h-8 flex items-center justify-center overflow-hidden"
        //   onClick={toggleWorkspace}
        // >
        //   <div
        //     className={cn(
        //       "absolute transition-transform duration-300 ease-in-out",
        //       workspace === "User"
        //         ? "translate-x-0 opacity-100"
        //         : "-translate-x-full opacity-0"
        //     )}
        //   >
        //     <MainIcon />
        //   </div>
        //   <div
        //     className={cn(
        //       "absolute transition-transform duration-300 ease-in-out",
        //       workspace === "User"
        //         ? "translate-x-full opacity-0"
        //         : "translate-x-0 opacity-100"
        //     )}
        //   >
        //     <SettingsIcon />
        //   </div>
        // </TabsTrigger>

        // VARIANT 3
        // <TabsTrigger
        //   value={workspace}
        //   className="relative w-8 h-8 flex items-center justify-center overflow-hidden"
        //   onClick={toggleWorkspace}
        // >
        //   <div
        //     className={cn(
        //       "absolute transition-transform duration-300 ease-in-out",
        //       isSliding && slideDirection === "left"
        //         ? "-translate-x-full opacity-0"
        //         : "translate-x-0 opacity-100"
        //     )}
        //   >
        //     <MainIcon />
        //   </div>
        //   <div
        //     className={cn(
        //       "absolute transition-transform duration-300 ease-in-out",
        //       isSliding && slideDirection === "right"
        //         ? "translate-x-full opacity-0"
        //         : "translate-x-0 opacity-100"
        //     )}
        //   >
        //     <SettingsIcon />
        //   </div>
        // </TabsTrigger>
      )}
    </TabsList>
  );
}
