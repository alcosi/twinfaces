"use client";

import { CalendarDays, Mail, User } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

import { AutoFormValueType } from "@/components/auto-field";

import {
  DomainUser,
  useFetchUserByAuthToken,
  useUpdateUser,
} from "@/entities/user";
import { InPlaceEdit, InPlaceEditProps } from "@/features/inPlaceEdit";
import { formatIntlDate, isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";

export function ProfileScreen() {
  const { updateUser } = useUpdateUser();
  const [user, setUser] = useState<DomainUser | undefined>(undefined);
  const { fetchUserByAuthToken, loading } = useFetchUserByAuthToken();

  useEffect(() => {
    refresh();
  }, [fetchUserByAuthToken]);

  async function refresh() {
    try {
      const fetchUser = await fetchUserByAuthToken();

      if (fetchUser) {
        setUser(fetchUser);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  }

  const nameSettings: InPlaceEditProps<string | undefined> = {
    id: "fullName",
    value: user?.user?.fullName,
    valueInfo: {
      type: AutoFormValueType.string,
      input_props: {
        fieldSize: "sm",
      },
      label: "",
    },
    schema: z.string().min(3),
    onSubmit: async (value) => {
      return updateUser({
        userId: user?.user?.id!,
        body: {
          fullName: value,
        },
      }).then(refresh);
    },
  };

  if (isUndefined(user) || loading) return <LoadingOverlay />;

  return (
    <>
      <div className="my-[15px] flex items-center">
        <div className="bg-muted mr-8 flex h-30 w-30 shrink-0 items-center justify-center rounded-full">
          <User className="text-brand-500 h-20 w-20" />
        </div>
        <div className="w-full flex-1">
          <div className="flex items-center">
            <span className="mr-4 text-2xl font-semibold">Hello,</span>
            <InPlaceEdit {...nameSettings} className="w-full break-all" />
          </div>
          <div className="text-muted-foreground flex items-center gap-1 text-lg font-semibold">
            <Mail className="h-5 w-5" />
            {user?.user?.email}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <CalendarDays className="h-4 w-4" />
        Together with us since {formatIntlDate(user?.createdAt!, "date")}
      </div>

      <div className="py-6">
        <p className="text-muted-foreground my-4 text-lg text-balance">
          Welcome to <b>On Shelves</b> – Your Central Hub for Managing Sales on{" "}
          <b>Amazon</b> and <b>Allegro</b>
        </p>
        <p className="text-muted-foreground w-1/2 text-balance">
          Take full control of your online sales with our smart platform that
          brings together the most essential features of Amazon and Allegro in
          one place.
        </p>
        <p className="text-muted-foreground my-2 w-2/3 text-balance">
          Our marketplace aggregator enables intuitive offer management, content
          optimization tailored to each platform’s requirements, and
          synchronization of optimization results across sales channels.
          Everything works smoothly and clearly – just like a well-organized
          shelf.
        </p>
      </div>
    </>
  );
}
