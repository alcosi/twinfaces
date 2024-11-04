"use client";

import { cn } from "@/shared/libs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";

export type Tab = {
  key: string;
  label: string;
  content: ReactNode;
};

type Props = {
  tabs: Tab[];
};

export function TabsLayout({ tabs }: Props) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.key);

  useEffect(() => {
    const hashKey = window.location.hash.slice(1);
    if (tabs.findIndex((tab) => tab.key === hashKey) > -1) {
      setActiveTab(hashKey);
    }
  }, [tabs]);

  function handleOnValueChange(value: string) {
    setActiveTab(value);
  }

  return (
    <Tabs value={activeTab} onValueChange={handleOnValueChange}>
      <nav className="flex w-full border-b mb-4">
        <TabsList>
          {tabs.map((tab) => (
            <Link href={`#${tab.key}`} key={tab.key}>
              <TabsTrigger
                value={tab.key}
                className={cn(
                  "px-3 py-4 border-b-2 border-transparent transition-colors duration-200",
                  "hover:border-b-primary hover:bg-secondary",
                  "data-[state=active]:border-b-link-light-active dark:data-[state=active]:border-b-link-dark-active"
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
