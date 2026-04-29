"use client";

import { TabsLayout } from "@/widgets/layout";

import {
  TwinAttachments,
  TwinComments,
  TwinFields,
  TwinGeneral,
  TwinHistory,
  TwinLinks,
  TwinTriggerTasks,
} from "./views";

const DEFAULT_TABS = [
  {
    key: "general",
    label: "General",
    content: <TwinGeneral />,
  },
  {
    key: "fields",
    label: "Fields",
    content: <TwinFields />,
  },
  {
    key: "relations",
    label: "Relations",
    content: <TwinLinks />,
  },
  {
    key: "comments",
    label: "Comments",
    content: <TwinComments />,
  },
  {
    key: "attachments",
    label: "Attachments",
    content: <TwinAttachments />,
  },
  {
    key: "history",
    label: "History",
    content: <TwinHistory />,
  },
  {
    key: "triggerTask",
    label: "Trigger task",
    content: <TwinTriggerTasks />,
  },
];

export function TwinScreen() {
  return <TabsLayout tabs={DEFAULT_TABS} />;
}
