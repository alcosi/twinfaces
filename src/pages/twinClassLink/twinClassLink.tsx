"use client";

import { TwinClassContext } from "@/app/twinclass/[twinClassId]/twin-class-context";
import { ReturnOptions, Section, SideNavLayout } from "@/widgets/layouts";
import { useContext } from "react";
import { GeneralSection } from "./views/general-section";

export const TwinClassLinkPage = () => {
  const { twinClassId } = useContext(TwinClassContext);

  const sections: Section[] = [
    {
      key: "general",
      label: "General",
      content: <GeneralSection />,
    },
  ];

  const returnOptions: ReturnOptions[] = [
    {
      path: `/twinclass/${twinClassId}#links`,
      label: "Back",
    },
  ];

  return <SideNavLayout sections={sections} returnOptions={returnOptions} />;
};
