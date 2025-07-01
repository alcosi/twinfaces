"use client";

import { CalendarDays, Mail, Pencil, User } from "lucide-react";
import { useContext, useState } from "react";
import { z } from "zod";

import { AutoFormValueType } from "@/components/auto-field";

import { useUpdateUser } from "@/entities/user";
import { useAuthUser } from "@/features/auth";
import { InPlaceEdit, InPlaceEditProps } from "@/features/inPlaceEdit";
import { UserContext } from "@/features/user";
import { formatIntlDate } from "@/shared/libs";
import { Button } from "@/shared/ui";

export function ProfileScreen() {
  const { authUser, updateUser: updateAuthUser } = useAuthUser();
  const { user, refresh } = useContext(UserContext);
  const { updateUser } = useUpdateUser();
  const [isEditing, setIsEditing] = useState(false);

  const nameSettings: InPlaceEditProps<string | undefined> = {
    id: "fullName",
    value: user.user?.fullName,
    valueInfo: {
      type: AutoFormValueType.string,
      input_props: {
        fieldSize: "sm",
      },
      label: "",
    },
    schema: z.string().min(3),
    onSubmit: async (value) => {
      setIsEditing(false);
      return updateUser({
        userId: user.userId!,
        body: {
          fullName: value,
        },
      })
        .then(refresh)
        .then(() => {
          if (!authUser?.domainUser) return;

          updateAuthUser({
            domainUser: {
              ...authUser.domainUser,
              user: {
                ...authUser.domainUser.user,
                fullName: value,
              },
            },
          });
        });
    },
    onCancelEditing: () => {
      setIsEditing(false);
    },
    shouldFocusOnStart: isEditing,
  };

  return (
    <>
      <div className="my-[15px] flex items-center">
        <div className="bg-muted mr-8 flex h-30 w-30 shrink-0 items-center justify-center rounded-full">
          <User className="text-brand-500 h-20 w-20" />
        </div>
        <div className="w-full flex-1">
          {!isEditing ? (
            <div className="group flex items-center">
              <div className="text-2xl font-semibold break-all">
                Hello, {user.user?.fullName}!
              </div>

              <Button
                onClick={() => setIsEditing(true)}
                size="iconS6"
                variant="ghost"
                className={
                  "ml-2 flex -translate-x-1 transform items-center opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                }
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <InPlaceEdit {...nameSettings} className="w-full" />
          )}
          <div className="text-muted-foreground flex items-center gap-1 text-lg font-semibold">
            <Mail className="h-5 w-5" />
            {user.user?.email}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <CalendarDays className="h-4 w-4" />
        Together with us since {formatIntlDate(user.createdAt!, "date")}
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
