"use client";

import { ReactNode, use } from "react";

import { NotificationContextProvider } from "@/features/notification";

type NotificationLayoutProps = {
  params: Promise<{
    notificationsId: string;
  }>;
  children: ReactNode;
};

export default function NotificationLayout(props: NotificationLayoutProps) {
  const params = use(props.params);

  const { notificationsId } = params;

  const { children } = props;

  return (
    <NotificationContextProvider notificationId={notificationsId}>
      {children}
    </NotificationContextProvider>
  );
}
