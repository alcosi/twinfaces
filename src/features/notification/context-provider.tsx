import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Notification_DETAILED,
  useFetchNotificationById,
} from "@/entities/notification";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";

type NotificationContextProps = {
  notificationId: string;
  notification: Notification_DETAILED;
  refresh: () => Promise<void>;
};

export const NotificationContext = createContext<NotificationContextProps>(
  {} as NotificationContextProps
);

export function NotificationContextProvider({
  notificationId,
  children,
}: {
  notificationId: string;
  children: ReactNode;
}) {
  const [notification, setNotification] = useState<
    Notification_DETAILED | undefined
  >(undefined);

  const { fetchNotificationById, isLoading } = useFetchNotificationById();

  const refresh = useCallback(async () => {
    try {
      const result = await fetchNotificationById(notificationId);

      if (result) setNotification(result);
    } catch (err) {
      console.error("Failed to fetch notification:", err);
    }
  }, [notificationId, fetchNotificationById]);

  useEffect(() => {
    refresh();
  }, [notificationId, refresh]);

  if (isUndefined(notification) || isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <NotificationContext.Provider
      value={{ notificationId, notification, refresh }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
