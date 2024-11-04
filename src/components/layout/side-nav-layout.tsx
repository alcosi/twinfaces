"use client";

import Link from "next/link";
import { cn } from "@/shared/libs";
import { Separator } from "@/components/base/separator";
import { ReactNode, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/base/button";
import { ChevronLeft } from "lucide-react";

export interface Section {
  key: string;
  label: string;
  content: ReactNode;
}

export interface ReturnOptions {
  path: string;
  label: string;
}

export interface SideNavLayoutProps {
  sections: Section[];
  defaultSectionKey?: string;
  children?: ReactNode;
  returnOptions?: ReturnOptions[];
}

// @deprecate
export function SideNavLayout({
  sections,
  defaultSectionKey,
  children,
  returnOptions,
}: SideNavLayoutProps) {
  const [selectedSection, setSelectedSection] = useState<Section>();

  useEffect(() => {
    if (sections.length == 0) {
      console.warn("SideNavLayout: No sections provided");
      return;
    }
    if (defaultSectionKey) {
      const section = sections.find(
        (section) => section.key === defaultSectionKey
      );
      setSelectedSection(section ?? sections[0]);
    } else {
      setSelectedSection(sections[0]);
    }
  }, []);

  const params = useParams();

  useEffect(() => {
    // check if pathname ends with any #section and set section accordingly
    const hash = window.location.hash.replace("#", "");
    const section = sections.find((section) => section.key === hash);
    setSelectedSection(section ?? sections[0]);
  }, [params]);

  return (
    <div className="mx-auto w-full flex md:flex-row flex-col gap-4">
      <nav className="flex-1 grid text-sm text-muted-foreground auto-rows-max md:max-w-60">
        {returnOptions && (
          <div className="mb-2">
            {returnOptions.map((option, index) => (
              <Link href={option.path} key={index}>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full justify-start mb-1"
                >
                  <ChevronLeft /> {option.label}
                </Button>
              </Link>
            ))}
          </div>
        )}
        {sections.map((section) => {
          const isSelected = section.key === selectedSection?.key;
          return (
            <Link href={`#${section.key}`} key={section.key}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  isSelected && "font-semibold bg-accent",
                  "w-full justify-start"
                )}
              >
                {section.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      <Separator className="h-auto" orientation="vertical" />

      <div className="flex-[4] pl-4 2xl:max-w-screen-xl mx-auto">
        {children}
        {sections.map(
          (section) =>
            section.key == selectedSection?.key && (
              <div key={section.key}>{section.content}</div>
            )
        )}
        {/*{selectedSection?.key === 'general' && twinClass &&*/}
        {/*    <TwinClassGeneral twinClass={twinClass} onChange={fetchClassData}/>}*/}
        {/*{selectedSection?.key === 'fields' && twinClass && <TwinClassFields twinClass={twinClass}/>}*/}
        {/*{selectedSection?.key === 'statuses' && twinClass && <TwinClassStatuses twinClass={twinClass}/>}*/}
        {/*{selectedSection?.key === 'twinflow' && twinClass && <TwinClassTwinflow twinClass={twinClass}/>}*/}
      </div>
    </div>
  );
}
