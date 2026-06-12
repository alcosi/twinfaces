"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";

import { cn, isPopulatedString } from "@/shared/libs";

export type Tab = {
  key: string;
  label: string;
  content: ReactNode;
};

type Props = {
  tabs: Tab[];
  rightSlot?: ReactNode;
};

export function TabsLayout({ tabs, rightSlot }: Props) {
  const hashKey = window.location.hash.slice(1);
  const defaultActiveTab = isPopulatedString(hashKey) ? hashKey : tabs[0]?.key;

  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  useEffect(() => {
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [tabs]);

  function handleHashChange() {
    const hashKey = window.location.hash.slice(1);

    if (tabs.find((tab) => tab.key === hashKey)) {
      setActiveTab(hashKey);
    } else {
      setActiveTab(defaultActiveTab);
    }
  }

  function handleOnValueChange(value: string) {
    setActiveTab(value);
  }

  return (
    <Tabs value={activeTab} onValueChange={handleOnValueChange}>
      <nav className="border-border bg-background sticky top-[var(--header-height)] z-20 flex w-full border-b">
        <div className="min-w-0 flex-1 overflow-x-auto">
          <TabsList className="flex min-w-max items-center gap-1 p-2">
            {tabs.map((tab) => (
              <Link href={`#${tab.key}`} key={tab.key}>
                <TabsTrigger
                  value={tab.key}
                  className={cn(
                    "text-muted-foreground rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200",
                    "hover:bg-muted hover:text-foreground",
                    "data-[state=active]:bg-brand-500/10 data-[state=active]:text-brand-600"
                  )}
                >
                  {tab.label}
                </TabsTrigger>
              </Link>
            ))}
          </TabsList>
        </div>
        {rightSlot ? (
          <div className="bg-background shrink-0 py-2 pr-0 pl-3">
            {rightSlot}
          </div>
        ) : null}
      </nav>
      {tabs.map((tab) => (
        <TabsContent key={tab.key} value={tab.key}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
