"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";

import { cn } from "@/shared/libs";

export type Tab = {
  key: string;
  label: string;
  content: ReactNode;
};

type Props = {
  tabs: Tab[];
};

export function TabsLayout({ tabs }: Props) {
  const [activeTab, setActiveTab] = useState<string>();

  useEffect(() => {
    const hashKey = window.location.hash.slice(1);
    const isValid = tabs.some((tab) => tab.key === hashKey);
    setActiveTab(isValid ? hashKey : tabs[0]?.key);
  }, [tabs]);

  function handleOnValueChange(value: string) {
    setActiveTab(value);
  }

  if (!activeTab) return null;

  return (
    <Tabs value={activeTab} onValueChange={handleOnValueChange}>
      <nav className="border-border bg-background sticky top-0 z-10 flex w-full overflow-x-auto border-b">
        <TabsList className="min-w-max">
          {tabs.map((tab) => (
            <Link href={`#${tab.key}`} key={tab.key}>
              <TabsTrigger
                value={tab.key}
                className={cn(
                  "border-b-2 border-transparent px-3 py-4 transition-colors duration-200",
                  "hover:border-b-primary hover:bg-secondary",
                  "data-[state=active]:border-b-link-enabled"
                )}
              >
                {tab.label}
              </TabsTrigger>
            </Link>
          ))}
        </TabsList>
      </nav>
      {tabs.map((tab) => (
        <TabsContent key={tab.key} value={tab.key}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
